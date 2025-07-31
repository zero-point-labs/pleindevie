import { NextRequest, NextResponse } from 'next/server';
import { leadCaptureFormSchema, type LeadCaptureFormData } from '@/lib/validation';
import { appwriteService, authService } from '@/lib/appwrite';
import { checkRateLimit } from '@/lib/ratelimit';

// Define the lead data structure with additional fields
interface Lead extends LeadCaptureFormData {
  id: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

// Rate-limiting configuration (window in ms)
const RATE_LIMITS = {
  FORM_SUBMISSION: 5, // submissions per 5 minutes per IP
  ADMIN_API: 100, // requests per minute per user
  WINDOW_MS: 5 * 60 * 1000,
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real;
  }
  return 'unknown';
}

// Middleware to check authentication for admin operations
async function requireAuth(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return user;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Function to send lead to external services (optional)
async function sendLeadToExternalService(lead: Lead) {
  const webhookUrl = process.env.WEBHOOK_URL;
  const emailService = process.env.EMAIL_SERVICE_URL;
  
  try {
    // Send to webhook if configured
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
    }
    
    // Send to email service if configured
    if (emailService) {
      await fetch(emailService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          subject: `New Lead: ${lead.name}`,
          html: `
            <h2>New Lead Submission</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Project Type:</strong> ${lead.projectType}</p>
            <p><strong>Budget:</strong> ${lead.budget}</p>
            <p><strong>Timeline:</strong> ${lead.timeline}</p>
            <p><strong>Message:</strong> ${lead.message || 'No additional message'}</p>
            <p><strong>Timestamp:</strong> ${lead.timestamp}</p>
          `
        })
      });
    }
    
    console.log('Lead sent to external services successfully');
  } catch (error) {
    console.error('Error sending lead to external services:', error);
    // Don't throw here - we still want to return success to the user
  }
}

// GET endpoint to retrieve leads (Admin only)
export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') console.log('GET /api/leads called');
    
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    
    // Rate limiting for admin operations
    const userKey = `admin-${authResult.email}`;
    if (!checkRateLimit(userKey, RATE_LIMITS.ADMIN_API, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Fetch leads from Appwrite
    const leads = await appwriteService.getLeads();
    if (process.env.NODE_ENV !== 'production') console.log(`Returning ${leads.length} leads from Appwrite`);
    
    return NextResponse.json({ 
      success: true, 
      leads,
      meta: {
        count: leads.length,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new lead
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') console.log('POST /api/leads called');
    
    // Rate limiting for form submissions
    const clientIP = getClientIP(request);
    const ipKey = `form-${clientIP}`;
    if (!checkRateLimit(ipKey, RATE_LIMITS.FORM_SUBMISSION, RATE_LIMITS.WINDOW_MS)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 }
      );
    }
    
    // Parse the request body
    const body = await request.json();

    // Validate the data using our Zod schema
    const validationResult = leadCaptureFormSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const leadData: LeadCaptureFormData = validationResult.data;

    // Create a new lead with additional fields
    const leadForAppwrite = {
      ...leadData,
      status: 'new' as const,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV !== 'production') console.log('Creating new lead in Appwrite');

    // Save to Appwrite
    const savedLead = await appwriteService.createLead(leadForAppwrite);
    
    // Create lead object for external services (includes the Appwrite document ID)
    const newLead: Lead = {
      ...leadData,
      id: savedLead.$id,
      timestamp: savedLead.timestamp,
      status: savedLead.status,
    };

    // Send to external services (webhooks, email, etc.)
    await sendLeadToExternalService(newLead);

    // Log the lead data for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('New lead captured successfully:', {
        id: savedLead.$id,
        projectType: savedLead.projectType,
        timestamp: savedLead.timestamp,
      });
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        leadId: savedLead.$id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing lead:', error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process lead submission',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update lead status (Admin only)
export async function PUT(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') console.log('PUT /api/leads called');
    
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Rate limiting for admin operations
    const userKey = `admin-${authResult.email}`;
    if (!checkRateLimit(userKey, RATE_LIMITS.ADMIN_API, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { leadId, status } = body;
    
    if (!leadId || !status) {
      return NextResponse.json(
        { error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }
    
    const validStatuses = ['new', 'contacted', 'qualified', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Update in Appwrite
    const updatedLead = await appwriteService.updateLeadStatus(leadId, status);
    
    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
      lead: updatedLead
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { error: 'Failed to update lead status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove lead (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') console.log('DELETE /api/leads called');
    
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Rate limiting for admin operations
    const userKey = `admin-${authResult.email}`;
    if (!checkRateLimit(userKey, RATE_LIMITS.ADMIN_API, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    // Delete from Appwrite
    await appwriteService.deleteLead(leadId);
    
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
