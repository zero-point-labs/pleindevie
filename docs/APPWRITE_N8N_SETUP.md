# Appwrite & n8n Integration Setup

This document explains how to set up the landing page to send form submissions to Appwrite via n8n.

## Architecture Overview

1. **User submits form** → Form data sent to n8n webhook
2. **n8n processes data** → n8n sends data to our `/api/webhooks/n8n` endpoint
3. **Next.js API** → Stores data in Appwrite database
4. **Admin panel** → Fetches leads from Appwrite database

## Setup Instructions

### 1. Appwrite Setup

1. Create an Appwrite project at [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a database for your project
3. Create a collection named "leads" with the following attributes:
   - `name` (String, required)
   - `email` (String, required)
   - `phone` (String, required)
   - `projectType` (String, required)
   - `budget` (String, required)
   - `timeline` (String, required)
   - `message` (String, optional)
   - `termsAccepted` (Boolean, required)
   - `marketingConsent` (Boolean, required)
   - `status` (String, required, default: "new")
   - `timestamp` (String, required)

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=your_collection_id_here

# n8n Webhook Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id

# Optional: External Services
WEBHOOK_URL=
EMAIL_SERVICE_URL=
ADMIN_EMAIL=admin@example.com
```

### 3. n8n Workflow Setup

1. **Install n8n locally** (as shown in your screenshot):
   ```bash
   npm install -g n8n
   n8n start
   ```

2. **Create a new workflow** with the following nodes:

   **Node 1: Webhook Trigger**
   - Set HTTP Method: POST
   - Copy the webhook URL for your environment variables

   **Node 2: HTTP Request Node**
   - Method: POST
   - URL: `http://localhost:3000/api/webhooks/n8n` (adjust for your deployment)
   - Headers: `Content-Type: application/json`
   - Body: Pass through the webhook data

3. **Test the workflow**:
   - Activate the workflow
   - Submit a test form
   - Check that data flows through to Appwrite

### 4. Appwrite Permissions

Make sure your Appwrite collection has the following permissions:
- **Create**: Allow for your application
- **Read**: Allow for your application  
- **Update**: Allow for your application (for status updates)
- **Delete**: Allow for your application (optional)

### 5. Testing the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Fill out the form** on your landing page

3. **Check the flow**:
   - Form data should be sent to n8n
   - n8n should forward data to `/api/webhooks/n8n`
   - Data should appear in your Appwrite database
   - Admin panel should display the new leads

## API Endpoints

### Form Submission Flow
- `POST /api/webhooks/n8n` - Receives data from n8n and stores in Appwrite

### Admin Panel APIs
- `GET /api/leads/appwrite` - Fetches leads from Appwrite
- `PATCH /api/leads/appwrite` - Updates lead status
- `DELETE /api/leads/appwrite` - Deletes a lead

### Fallback APIs
- `GET /api/leads` - Original local storage API (fallback)
- `POST /api/leads` - Original form submission API (fallback)

## Troubleshooting

### Form submissions not reaching Appwrite
1. Check that `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set correctly
2. Verify n8n workflow is active and accessible
3. Check n8n logs for errors
4. Verify `/api/webhooks/n8n` endpoint is working

### Admin panel not showing leads
1. Check Appwrite permissions
2. Verify environment variables are set correctly
3. Check browser console for API errors
4. Test `/api/leads/appwrite` endpoint directly

### n8n Connection Issues
1. Ensure n8n is running (`http://localhost:5678`)
2. Check webhook URL format
3. Test webhook manually with curl:
   ```bash
   curl -X POST your-n8n-webhook-url \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com",...}'
   ```

## Production Deployment

1. **Update environment variables** for production Appwrite endpoint
2. **Update n8n webhook URL** to point to your deployed application
3. **Set up n8n in production** or use n8n Cloud
4. **Test the complete flow** in production environment

## Security Considerations

1. **API Keys**: Never expose Appwrite API keys in client-side code
2. **Webhook Security**: Consider adding webhook validation/signatures
3. **Rate Limiting**: Implement rate limiting on webhook endpoints
4. **Data Validation**: All data is validated using Zod schemas before storage 