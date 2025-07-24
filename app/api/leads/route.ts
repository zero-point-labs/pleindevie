import { NextRequest, NextResponse } from 'next/server';
import { leadCaptureFormSchema, type LeadCaptureFormData } from '@/lib/validation';

// Define the lead data structure with additional fields
interface Lead extends LeadCaptureFormData {
  id: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

// In production, we'll store leads in memory for the request duration
// and optionally send to external services (webhook, email, etc.)
const temporaryLeads: Lead[] = [];

// Function to send lead to external services (optional)
async function sendLeadToExternalService(lead: Lead) {
  // You can configure these environment variables in Vercel
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

// GET endpoint to retrieve leads (returns empty array in production for security)
export async function GET() {
  try {
    // In production, we don't expose leads via GET for security reasons
    // You should use a proper database and authentication for this
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: true, leads: [], message: 'Leads access restricted in production' },
        { status: 200 }
      );
    }
    
    // In development, return temporary leads
    return NextResponse.json({ success: true, leads: temporaryLeads }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new lead
export async function POST(request: NextRequest) {
  try {
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
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'new',
    };

    // Store temporarily (for development)
    temporaryLeads.push(newLead);

    // Send to external services (webhooks, email, etc.)
    await sendLeadToExternalService(newLead);

    // Log the lead data for debugging (remove sensitive info in production)
    console.log('New lead captured:', {
      id: newLead.id,
      name: newLead.name,
      email: newLead.email,
      projectType: newLead.projectType,
      timestamp: newLead.timestamp,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        leadId: newLead.id,
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
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
