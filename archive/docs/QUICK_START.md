# 🚀 Quick Start Guide - Appwrite & n8n Integration

Get your landing page connected to Appwrite via n8n in under 10 minutes!

## Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **n8n**: Already running locally (as seen in your screenshot)
3. **Node.js**: Already installed

## Step 1: Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project
3. Copy your **Project ID** from the project dashboard
4. Go to **Settings** → **API Keys**
5. Create a new API key with the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read` 
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `documents.read`
   - `documents.write`

## Step 2: Run Automated Setup

Run our automated setup script that will create everything for you:

```bash
npm run setup:appwrite
```

The script will ask for:
- **Appwrite Endpoint** (default: https://cloud.appwrite.io/v1)
- **Project ID** (from Step 1)
- **API Key** (from Step 1)

### What the script does:
✅ Creates a new database  
✅ Creates a "leads" collection  
✅ Sets up all required attributes (name, email, phone, etc.)  
✅ Configures proper permissions  
✅ Creates database indexes for performance  
✅ Generates `.env.local` file with all configuration  

## Step 3: Set Up n8n Workflow

1. **Open n8n** (http://localhost:5678)

2. **Create a new workflow** with these nodes:

   **Node 1: Webhook**
   - Trigger type: Webhook
   - HTTP Method: POST
   - Copy the webhook URL

   **Node 2: HTTP Request**
   - Method: POST
   - URL: `http://localhost:3000/api/webhooks/n8n`
   - Headers: `Content-Type: application/json`
   - Body: Raw/JSON → `{{ $json }}`

3. **Connect the nodes**: Webhook → HTTP Request

4. **Activate the workflow**

5. **Copy the webhook URL** and add it to `.env.local`:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id
   ```

## Step 4: Test Everything

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the webhook endpoint**:
   ```bash
   npm run test:webhook
   ```

3. **Test the form submission**:
   - Go to http://localhost:3000
   - Fill out and submit the form
   - Check the admin panel at http://localhost:3000/admin

## Step 5: Verify Integration

### Check Data Flow:
1. **Form submitted** → Check browser network tab
2. **n8n receives data** → Check n8n execution log
3. **Webhook processes data** → Check terminal logs
4. **Data in Appwrite** → Check Appwrite database
5. **Admin panel shows lead** → Check admin dashboard

### Troubleshooting:
```bash
# Test webhook directly
npm run test:webhook

# Check if Appwrite is accessible
curl -X GET "https://cloud.appwrite.io/v1/health" 

# Test n8n webhook manually
curl -X POST your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","projectType":"Kitchen","budget":"$50k-$100k","timeline":"1-3 months","termsAccepted":true,"marketingConsent":false}'
```

## 🎉 You're Done!

Your landing page now has:
- ✅ Professional cloud database (Appwrite)
- ✅ Automated workflow processing (n8n)
- ✅ Real-time admin panel
- ✅ Scalable architecture
- ✅ Fallback systems

## Production Deployment

When ready for production:

1. **Update environment variables** for production
2. **Set up n8n in production** (or use n8n Cloud)
3. **Update webhook URLs** to production domains
4. **Test the complete flow**

## Need Help?

- **Setup Issues**: Check `docs/APPWRITE_N8N_SETUP.md` for detailed troubleshooting
- **Integration Details**: See `docs/INTEGRATION_SUMMARY.md` for complete overview
- **Test Scripts**: Use `npm run test:webhook` to verify functionality

---

**That's it!** You now have a professional lead management system with cloud database and automation! 🚀 