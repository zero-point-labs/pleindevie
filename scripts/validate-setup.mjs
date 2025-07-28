#!/usr/bin/env node

// Validation script to check if Appwrite setup is working correctly

import { Client, Databases } from 'node-appwrite';
import * as fs from 'fs';

async function validateSetup() {
  console.log('🔍 Validating Appwrite Setup');
  console.log('============================\n');

  try {
    // Check if .env.local exists
    if (!fs.existsSync('.env.local')) {
      console.error('❌ .env.local file not found!');
      console.log('💡 Run: npm run setup:appwrite');
      return false;
    }

    // Read environment variables
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        envVars[key.trim()] = value.trim();
      }
    });

    const required = [
      'NEXT_PUBLIC_APPWRITE_ENDPOINT',
      'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
      'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
      'NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID'
    ];
    
    const apiKey = envVars.APPWRITE_API_KEY;

    console.log('📋 Checking environment variables...');
    for (const varName of required) {
      if (envVars[varName]) {
        console.log(`  ✅ ${varName}: ${envVars[varName]}`);
      } else {
        console.log(`  ❌ ${varName}: Missing!`);
        return false;
      }
    }

    // Test Appwrite connection
    console.log('\n🔌 Testing Appwrite connection...');
    
    const client = new Client();
    client
      .setEndpoint(envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    
    if (apiKey) {
      client.setKey(apiKey);
      console.log('  ✅ Using API key for validation');
    } else {
      console.log('  ⚠️  No API key found - some validations may fail');
    }

    const databases = new Databases(client);

    try {
      // Try to get the database
      const database = await databases.get(envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
      console.log(`  ✅ Database connected: ${database.name}`);

      // Try to get the collection
      const collection = await databases.getCollection(
        envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        envVars.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID
      );
      console.log(`  ✅ Collection found: ${collection.name}`);

      // Check collection attributes
      console.log('\n📊 Checking collection attributes...');
      const expectedAttributes = [
        'name', 'email', 'phone', 'projectType', 'budget', 
        'timeline', 'message', 'termsAccepted', 'marketingConsent', 
        'status', 'timestamp'
      ];

      const actualAttributes = collection.attributes.map(attr => attr.key);
      
      for (const attr of expectedAttributes) {
        if (actualAttributes.includes(attr)) {
          console.log(`  ✅ ${attr}`);
        } else {
          console.log(`  ❌ ${attr} - Missing!`);
        }
      }

      // Test a simple query to check permissions
      console.log('\n🔐 Testing permissions...');
      try {
        const documents = await databases.listDocuments(
          envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          envVars.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID
        );
        console.log(`  ✅ Read permission works - Found ${documents.documents.length} documents`);
      } catch (permError) {
        console.log(`  ❌ Read permission failed: ${permError.message}`);
      }

    } catch (dbError) {
      console.log(`  ❌ Database/Collection error: ${dbError.message}`);
      return false;
    }

    // Check n8n webhook URL
    console.log('\n🪝 Checking n8n configuration...');
    if (envVars.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      console.log(`  ✅ n8n webhook URL: ${envVars.NEXT_PUBLIC_N8N_WEBHOOK_URL}`);
    } else {
      console.log('  ⚠️  n8n webhook URL not configured yet');
      console.log('     Add NEXT_PUBLIC_N8N_WEBHOOK_URL to .env.local');
    }

    console.log('\n🎉 Setup validation completed successfully!');
    console.log('\nNext steps:');
    if (!envVars.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      console.log('1. Set up n8n workflow and add webhook URL to .env.local');
      console.log('2. Run: npm run dev');
      console.log('3. Test with: npm run test:webhook');
    } else {
      console.log('1. Run: npm run dev');
      console.log('2. Test with: npm run test:webhook');
      console.log('3. Try submitting the form on your landing page');
    }

    return true;

  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('- Check your internet connection');
    console.log('- Verify your Appwrite project ID and API key');
    console.log('- Make sure your Appwrite project is active');
    console.log('- Run: npm run setup:appwrite to recreate setup');
    return false;
  }
}

validateSetup().catch(console.error); 