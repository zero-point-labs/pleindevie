import { NextRequest, NextResponse } from 'next/server';
import { appwriteService, type AppwriteLead } from '@/lib/appwrite';
import { leadCaptureFormSchema, type LeadCaptureFormData } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    console.log('n8n webhook received');
    
    // Parse the request body
    const body = await request.json();
    console.log('Webhook payload:', body);

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

    // Prepare lead data for Appwrite
    const appwriteLeadData: Omit<AppwriteLead, '$id' | '$createdAt' | '$updatedAt'> = {
      ...leadData,
      marketingConsent: leadData.marketingConsent ?? false,
      status: 'new',
      timestamp: new Date().toISOString(),
    };

    console.log('Creating lead in Appwrite:', appwriteLeadData);

    // Save to Appwrite
    const createdLead = await appwriteService.createLead(appwriteLeadData);

    console.log('Lead created successfully in Appwrite:', createdLead.$id);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully via n8n',
        leadId: createdLead.$id,
        appwriteId: createdLead.$id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing n8n webhook:', error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process webhook from n8n',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      message: 'n8n webhook endpoint',
      method: 'POST',
      description: 'This endpoint receives lead data from n8n and stores it in Appwrite'
    },
    { status: 200 }
  );
}

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