#!/usr/bin/env node

// Test script for the n8n webhook endpoint
// Usage: node scripts/test-webhook.js

const testData = {
  name: "Test User",
  email: "test@example.com",
  phone: "+1234567890",
  projectType: "Kitchen",
  budget: "$50k-$100k",
  timeline: "1-3 months",
  message: "This is a test submission from the webhook test script",
  termsAccepted: true,
  marketingConsent: false
};

async function testWebhook() {
  try {
    console.log('Testing webhook endpoint...');
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/webhooks/n8n', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Webhook test successful!');
      if (responseData.leadId) {
        console.log('Lead ID:', responseData.leadId);
      }
    } else {
      console.log('\n❌ Webhook test failed!');
    }
    
  } catch (error) {
    console.error('\n❌ Error testing webhook:', error.message);
  }
}

async function testAppwriteEndpoint() {
  try {
    console.log('\n\nTesting Appwrite leads endpoint...');
    
    const response = await fetch('http://localhost:3000/api/leads/appwrite');
    const responseData = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Appwrite endpoint test successful!');
      console.log('Number of leads:', responseData.leads?.length || 0);
    } else {
      console.log('\n❌ Appwrite endpoint test failed!');
    }
    
  } catch (error) {
    console.error('\n❌ Error testing Appwrite endpoint:', error.message);
  }
}

// Run tests
console.log('🧪 Running webhook and Appwrite endpoint tests...\n');

testWebhook().then(() => {
  return testAppwriteEndpoint();
}).then(() => {
  console.log('\n🏁 Tests completed!');
}).catch((error) => {
  console.error('Test runner error:', error);
}); 