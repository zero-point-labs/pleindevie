import { Client, Databases, Account, ID, Models } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);
export const account = new Account(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const LEADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID || '';

// Lead interface for Appwrite
export interface AppwriteLead extends Models.Document {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message?: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  timestamp: string;
}

// Auth service functions
export const authService = {
  // Login with email and password
  async login(email: string, password: string): Promise<Models.Session> {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await account.get();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get current session
  async getCurrentSession(): Promise<Models.Session | null> {
    try {
      return await account.getSession('current');
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }
};

// Appwrite service functions
export const appwriteService = {
  // Create a new lead
  async createLead(leadData: Omit<AppwriteLead, keyof Models.Document>): Promise<AppwriteLead> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        ID.unique(),
        leadData
      );
      return response as AppwriteLead;
    } catch (error) {
      console.error('Error creating lead in Appwrite:', error);
      throw error;
    }
  },

  // Get all leads
  async getLeads(): Promise<AppwriteLead[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LEADS_COLLECTION_ID
      );
      return response.documents as AppwriteLead[];
    } catch (error) {
      console.error('Error fetching leads from Appwrite:', error);
      throw error;
    }
  },

  // Get a single lead by ID
  async getLead(leadId: string): Promise<AppwriteLead> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        leadId
      );
      return response as AppwriteLead;
    } catch (error) {
      console.error('Error fetching lead from Appwrite:', error);
      throw error;
    }
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: AppwriteLead['status']): Promise<AppwriteLead> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        leadId,
        { status }
      );
      return response as AppwriteLead;
    } catch (error) {
      console.error('Error updating lead status in Appwrite:', error);
      throw error;
    }
  },

  // Delete a lead
  async deleteLead(leadId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        leadId
      );
    } catch (error) {
      console.error('Error deleting lead from Appwrite:', error);
      throw error;
    }
  }
};

export default client; 