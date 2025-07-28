import { NextRequest, NextResponse } from 'next/server';
import { appwriteService, type AppwriteLead } from '@/lib/appwrite';
import { leadCaptureFormSchema, type LeadCaptureFormData } from '@/lib/validation';

// GET endpoint to retrieve leads from Appwrite
export async function GET() {
  try {
    console.log('GET /api/leads/appwrite called');
    
    const leads = await appwriteService.getLeads();
    console.log(`Returning ${leads.length} leads from Appwrite`);
    
    // Transform Appwrite leads to match the expected format
    const formattedLeads = leads.map((lead) => ({
      id: lead.$id || '',
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      projectType: lead.projectType,
      budget: lead.budget,
      timeline: lead.timeline,
      message: lead.message,
      timestamp: lead.$createdAt || lead.timestamp,
      status: lead.status,
    }));
    
    return NextResponse.json({ 
      success: true, 
      leads: formattedLeads,
      meta: {
        count: formattedLeads.length,
        source: 'appwrite',
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads from Appwrite:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch leads from Appwrite', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Direct Appwrite API endpoint called');
    
    // Parse the request body
    const body = await request.json();
    console.log('Direct API payload:', body);

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
        message: 'Lead captured successfully',
        leadId: createdLead.$id,
        appwriteId: createdLead.$id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing direct API request:', error);

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

// PATCH endpoint to update lead status
export async function PATCH(request: NextRequest) {
  try {
    console.log('PATCH /api/leads/appwrite called');
    
    const body = await request.json();
    const { leadId, status } = body;
    
    if (!leadId || !status) {
      return NextResponse.json(
        { error: 'leadId and status are required' },
        { status: 400 }
      );
    }
    
    const validStatuses = ['new', 'contacted', 'qualified', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const updatedLead = await appwriteService.updateLeadStatus(leadId, status);
    
    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
      lead: {
        id: updatedLead.$id,
        status: updatedLead.status,
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating lead status in Appwrite:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update lead status', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a lead
export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/leads/appwrite called');
    
    const url = new URL(request.url);
    const leadId = url.searchParams.get('leadId');
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }
    
    await appwriteService.deleteLead(leadId);
    
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
      leadId
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting lead from Appwrite:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete lead', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 