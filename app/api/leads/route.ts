import { NextRequest, NextResponse } from 'next/server';
import { leadCaptureFormSchema, type LeadCaptureFormData } from '@/lib/validation';
import { promises as fs } from 'fs';
import path from 'path';

// Define the lead data structure with additional fields
interface Lead extends LeadCaptureFormData {
  id: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

// Global variable with better initialization
declare global {
  var __LEADS_STORAGE__: {
    leads: Lead[];
    lastUpdated: number;
  } | undefined;
}

// Initialize global storage with timestamp
function initializeGlobalStorage() {
  if (!global.__LEADS_STORAGE__) {
    global.__LEADS_STORAGE__ = {
      leads: [],
      lastUpdated: Date.now()
    };
    console.log('Initialized global leads storage');
  }
  return global.__LEADS_STORAGE__;
}

// Path to the leads data file (for local development)
const LEADS_FILE_PATH = path.join(process.cwd(), 'data', 'leads.json');

// Storage functions that work in both environments
async function readLeads(): Promise<Lead[]> {
  try {
    console.log('Reading leads, environment:', process.env.NODE_ENV);
    
    // Initialize global storage
    const storage = initializeGlobalStorage();
    
    // Try to read from file first (works in local development)
    if (process.env.NODE_ENV === 'development') {
      try {
        const dataDir = path.dirname(LEADS_FILE_PATH);
        await fs.mkdir(dataDir, { recursive: true });
        
        const data = await fs.readFile(LEADS_FILE_PATH, 'utf-8');
        const fileLeads = JSON.parse(data);
        
        // Sync global storage with file storage
        storage.leads = fileLeads;
        storage.lastUpdated = Date.now();
        
        console.log(`Loaded ${fileLeads.length} leads from file`);
        return fileLeads;
      } catch (fileError) {
        console.log('File not found, creating new one');
        // File doesn't exist or can't be read, create it with empty array
        await fs.writeFile(LEADS_FILE_PATH, JSON.stringify([], null, 2));
        return [];
      }
    }
    
    // In production (Vercel), use global variable with demo fallback
    console.log(`Using global storage with ${storage.leads.length} leads`);
    
    // If no leads in storage and it's production, add some demo data
    if (storage.leads.length === 0 && process.env.NODE_ENV === 'production') {
      const demoLeads: Lead[] = [
        {
          id: 'demo_lead_1',
          name: 'Demo Customer 1',
          email: 'demo1@example.com',
          phone: '+1234567890',
          projectType: 'Kitchen',
                     budget: '$50k-$100k',
          timeline: '1-3 months',
          message: 'Interested in kitchen renovation',
          termsAccepted: true,
          marketingConsent: true,
          timestamp: new Date().toISOString(),
          status: 'new'
        },
        {
          id: 'demo_lead_2',
          name: 'Demo Customer 2',
          email: 'demo2@example.com',
          phone: '+1234567891',
          projectType: 'Bathroom',
                     budget: '$25k-$50k',
          timeline: '3-6 months',
          message: 'Looking for bathroom remodel',
          termsAccepted: true,
          marketingConsent: false,
          timestamp: new Date().toISOString(),
          status: 'new'
        }
      ];
      storage.leads = demoLeads;
      console.log('Added demo leads for production');
    }
    
    return storage.leads;
  } catch (error) {
    console.error('Error reading leads:', error);
    const storage = initializeGlobalStorage();
    return storage.leads;
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  try {
    console.log(`Writing ${leads.length} leads`);
    
    // Update global storage
    const storage = initializeGlobalStorage();
    storage.leads = leads;
    storage.lastUpdated = Date.now();
    
    // Try to write to file (works in local development)
    if (process.env.NODE_ENV === 'development') {
      try {
        const dataDir = path.dirname(LEADS_FILE_PATH);
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2));
        console.log('Leads written to file successfully');
      } catch (fileError) {
        console.log('File write failed (expected in Vercel), using memory storage');
      }
    }
    
    console.log('Leads written to global storage successfully');
  } catch (error) {
    console.error('Error writing leads:', error);
  }
}

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

// GET endpoint to retrieve leads
export async function GET() {
  try {
    console.log('GET /api/leads called');
    const leads = await readLeads();
    console.log(`Returning ${leads.length} leads`);
    
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
    console.log('POST /api/leads called');
    
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

    console.log('Created new lead:', newLead.id);

    // Read existing leads
    const existingLeads = await readLeads();
    console.log(`Found ${existingLeads.length} existing leads`);
    
    // Add the new lead
    existingLeads.push(newLead);
    
    // Keep only the last 100 leads to prevent memory issues
    const leadsToStore = existingLeads.slice(-100);
    console.log(`Storing ${leadsToStore.length} leads`);
    
    // Save leads
    await writeLeads(leadsToStore);

    // Send to external services (webhooks, email, etc.)
    await sendLeadToExternalService(newLead);

    // Log the lead data for debugging
    console.log('New lead captured successfully:', {
      id: newLead.id,
      name: newLead.name,
      email: newLead.email,
      projectType: newLead.projectType,
      timestamp: newLead.timestamp,
      totalLeads: leadsToStore.length,
      environment: process.env.NODE_ENV
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        leadId: newLead.id,
        totalLeads: leadsToStore.length
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
