# Environment Setup for GA4 Analytics

## Step 1: Create .env.local file

Create a new file called `.env.local` in your project root and copy this template:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_ID=G-S8HC4LNC73

# Google Analytics Data API (for real analytics data)
# Replace with your actual Property ID from GA4 Admin > Property Settings
GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE

# Service Account Key (all on one line, no extra quotes)
# Replace with your own service account JSON from Google Cloud Console
GA4_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

## Step 2: Create Your Own Service Account

**Important:** Don't use someone else's service account! Create your own:

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select Project:**
   - Click the project dropdown at the top
   - Create a new project or select existing one

3. **Enable Google Analytics Data API:**
   - Search for "Google Analytics Data API"
   - Click on it and click **"Enable"**

4. **Create Service Account:**
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **"+ CREATE SERVICE ACCOUNT"**
   - Name: `analytics-reader`
   - Description: `Read GA4 data for website dashboard`
   - Click **"CREATE AND CONTINUE"** → **"CONTINUE"** → **"DONE"**

5. **Download JSON Key:**
   - Click on your new service account email
   - Go to **"KEYS"** tab
   - Click **"ADD KEY"** → **"Create new key"** → **"JSON"**
   - The JSON file will download to your computer

6. **Format for Environment Variable:**
   - Open the downloaded JSON file
   - Copy the entire JSON content
   - Remove all line breaks to make it one line
   - Paste it as the value for `GA4_SERVICE_ACCOUNT_KEY`

## Step 3: Get Your GA4 Property ID

1. Go to [analytics.google.com](https://analytics.google.com/)
2. Click **Admin** (gear icon) in the bottom left
3. Make sure you're in the correct Property column (the one with your G-S8HC4LNC73 measurement ID)
4. Click **"Property settings"**
5. Copy the **Property ID** number (it's just a number like `123456789`)
6. Replace `YOUR_PROPERTY_ID_HERE` in your `.env.local` with this number

## Step 4: Add Service Account to GA4

1. Still in **Admin** → **Property** column
2. Click **"Property access management"**
3. Click the blue **"+"** button → **"Add users"**
4. **Email address:** Your service account email (from the JSON file)
5. **Role:** Select **"Viewer"**
6. **Notify new users via email:** Uncheck this
7. Click **"Add"**

## Step 5: Test

1. Restart your dev server: `npm run dev`
2. Visit your admin dashboard
3. Check browser console for: `"✅ Using real GA4 data for analytics dashboard"`

## Example .env.local

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_ID=G-S8HC4LNC73

# Google Analytics Data API
GA4_PROPERTY_ID=123456789
GA4_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"analytics-reader@my-project.iam.gserviceaccount.com","client_id":"123","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/analytics-reader%40my-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

## Important Security Notes

- **Never commit your `.env.local` file** to Git (it's already in .gitignore)
- **Never share your service account JSON** publicly
- **Use your own service account** - don't use examples from tutorials
- **Keep your credentials secure** and rotate them periodically

## If you see errors:

- **"Unexpected token"**: The JSON formatting is wrong (must be one line)
- **"Property not found"**: Wrong Property ID or missing permissions
- **"Access denied"**: Service account not added to GA4 property
- **"GA4 not configured"**: Missing environment variables or incorrect format

Once set up correctly, you'll see real analytics data instead of demo data! 🎉

## Troubleshooting

If you're still seeing demo data:
1. Check that both `GA4_PROPERTY_ID` and `GA4_SERVICE_ACCOUNT_KEY` are set
2. Verify the service account has "Viewer" access to your GA4 property
3. Make sure the Property ID matches your GA4 property (numbers only)
4. Restart your development server after changing environment variables 