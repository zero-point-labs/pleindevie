#!/usr/bin/env node

// Automated Appwrite setup script
// This script creates the database, collection, attributes, and permissions automatically

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
function loadEnvVars() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envVars = {};
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        envVars[key.trim()] = value.trim();
      }
    });
  }
  
  return envVars;
}

async function main() {
  console.log('🚀 Appwrite Automatic Setup Script');
  console.log('=====================================\n');

  try {
    // Load environment variables
    const envVars = loadEnvVars();
    
    const endpoint = envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = envVars.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;
    
    if (!endpoint || !projectId || !apiKey) {
      console.error('❌ Missing required environment variables!');
      console.log('\n📋 Please create a .env.local file with:');
      console.log('NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1');
      console.log('NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id');
      console.log('APPWRITE_API_KEY=your_api_key');
      console.log('\n💡 Or copy from env.template file');
      process.exit(1);
    }

    console.log('🔧 Setting up Appwrite client...');
    console.log(`📍 Endpoint: ${endpoint}`);
    console.log(`📋 Project: ${projectId}`);
    console.log(`🔑 API Key: ${apiKey.substring(0, 20)}...`);
    
    // Initialize Appwrite client
    const client = new Client();
    client.setEndpoint(endpoint);
    client.setProject(projectId);
    client.setKey(apiKey);

    const databases = new Databases(client);

    // Create database
    console.log('📂 Creating database...');
    const databaseId = ID.unique();
    const database = await databases.create(databaseId, 'Renovation Leads DB');
    console.log('✅ Database created:', database.name, `(ID: ${databaseId})`);

    // Create collection
    console.log('📋 Creating leads collection...');
    const collectionId = ID.unique();
    const collection = await databases.createCollection(
      databaseId, 
      collectionId, 
      'leads',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );
    console.log('✅ Collection created:', collection.name, `(ID: ${collectionId})`);

    // Define attributes to create
    const attributes = [
      { key: 'name', type: 'string', size: 100, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 20, required: true },
      { key: 'projectType', type: 'enum', elements: ['Kitchen', 'Bathroom', 'Whole Home', 'Living Room', 'Basement', 'Other'], required: true },
      { key: 'budget', type: 'enum', elements: ['$25k-$50k', '$50k-$100k', '$100k-$200k', '$200k+', 'Not Sure'], required: true },
      { key: 'timeline', type: 'enum', elements: ['ASAP', '1-3 months', '3-6 months', '6+ months', 'Just exploring'], required: true },
      { key: 'message', type: 'string', size: 1000, required: false },
      { key: 'termsAccepted', type: 'boolean', required: true },
      { key: 'marketingConsent', type: 'boolean', required: true },
      { key: 'status', type: 'enum', elements: ['new', 'contacted', 'qualified', 'closed'], required: true },
      { key: 'timestamp', type: 'string', size: 50, required: true }
    ];

    console.log('🏗️  Creating attributes...');
    
    for (const attr of attributes) {
      try {
        console.log(`  Creating ${attr.key} (${attr.type})...`);
        
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            databaseId, 
            collectionId, 
            attr.key, 
            attr.size, 
            attr.required,
            attr.default || null
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            databaseId, 
            collectionId, 
            attr.key, 
            attr.required,
            attr.default || null
          );
        } else if (attr.type === 'enum') {
          await databases.createEnumAttribute(
            databaseId, 
            collectionId, 
            attr.key, 
            attr.elements, 
            attr.required,
            attr.default || null
          );
        }
        
        console.log(`  ✅ ${attr.key} created`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`  ❌ Failed to create ${attr.key}:`, error.message);
      }
    }

    console.log('\n📝 Creating indexes for better performance...');
    
    // Create useful indexes
    const indexes = [
      { key: 'email_index', type: 'key', attributes: ['email'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'timestamp_index', type: 'key', attributes: ['timestamp'] },
      { key: 'projectType_index', type: 'key', attributes: ['projectType'] }
    ];

    for (const index of indexes) {
      try {
        console.log(`  Creating ${index.key}...`);
        await databases.createIndex(
          databaseId,
          collectionId,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`  ✅ ${index.key} created`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Failed to create ${index.key}:`, error.message);
      }
    }

    // Generate environment variables
    console.log('\n📋 Your environment variables:');
    console.log('================================');
    console.log(`NEXT_PUBLIC_APPWRITE_ENDPOINT=${endpoint}`);
    console.log(`NEXT_PUBLIC_APPWRITE_PROJECT_ID=${projectId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=${collectionId}`);
    console.log('');

    // Update .env.local file with new IDs
    const envPath = '.env.local';
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      // Read existing .env.local and update the IDs
      envContent = fs.readFileSync(envPath, 'utf-8');
      envContent = envContent.replace(
        /NEXT_PUBLIC_APPWRITE_DATABASE_ID=.*/,
        `NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=.*/,
        `NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=${collectionId}`
      );
    } else {
      // Create new .env.local file
      envContent = `# Appwrite Configuration (Auto-generated)
NEXT_PUBLIC_APPWRITE_ENDPOINT=${endpoint}
NEXT_PUBLIC_APPWRITE_PROJECT_ID=${projectId}
NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}
NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=${collectionId}

# Appwrite API Key (for setup script only - keep this secure)
APPWRITE_API_KEY=${apiKey}

# n8n Configuration (Add your webhook URL)
NEXT_PUBLIC_N8N_WEBHOOK_URL=

# Optional: External Services
WEBHOOK_URL=
EMAIL_SERVICE_URL=
ADMIN_EMAIL=admin@example.com
`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment variables updated in .env.local');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set up your n8n webhook URL in .env.local');
    console.log('2. Run: npm run dev');
    console.log('3. Test the integration with: npm run test:webhook');
    console.log('\nYour Appwrite database is ready to receive leads! 🚀');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nCommon issues:');
    console.error('- Make sure your API key has the correct permissions');
    console.error('- Check that your project ID is correct');
    console.error('- Ensure your Appwrite instance is accessible');
    console.error('- Verify your .env.local file has the correct values');
  }
}

main().catch(console.error); 