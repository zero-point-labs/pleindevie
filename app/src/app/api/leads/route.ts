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

// Path to the leads data file
const LEADS_FILE_PATH = path.join(process.cwd(), 'data', 'leads.json');

// Ensure the data directory and file exist
async function ensureDataFile() {
  try {
    const dataDir = path.dirname(LEADS_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if file exists, if not create it with empty array
    try {
      await fs.access(LEADS_FILE_PATH);
    } catch {
      await fs.writeFile(LEADS_FILE_PATH, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
  }
}

// Read leads from file
async function readLeads(): Promise<Lead[]> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(LEADS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads:', error);
    return [];
  }
}

// Write leads to file
async function writeLeads(leads: Lead[]): Promise<void> {
  try {
    await ensureDataFile();
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error writing leads:', error);
    throw error;
  }
}

// GET endpoint to retrieve all leads
export async function GET() {
  try {
    const leads = await readLeads();
    return NextResponse.json({ success: true, leads }, { status: 200 });
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

    // Read existing leads
    const existingLeads = await readLeads();

    // Add the new lead
    existingLeads.push(newLead);

    // Save back to file
    await writeLeads(existingLeads);

    // Log the lead data for debugging
    console.log('New lead saved:', {
      id: newLead.id,
      name: newLead.name,
      email: newLead.email,
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
