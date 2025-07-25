# Environment Setup for GA4 Analytics

## Step 1: Create .env.local file

Create a new file called `.env.local` in your project root and copy this content exactly:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_ID=G-xxxxxx

# Google Analytics Data API (for real analytics data)
# Replace YOUR_PROPERTY_ID_HERE with your actual Property ID
GA4_PROPERTY_ID=

# Service Account Key (all on one line, no extra quotes)
GA4_SERVICE_ACCOUNT_KEY=
## Step 2: Get Your GA4 Property ID

1. Go to [analytics.google.com](https://analytics.google.com/)
2. Click **Admin** (gear icon) in the bottom left
3. Make sure you're in the correct Property column (the one with your G-S8HC4LNC73 measurement ID)
4. Click **"Property settings"**
5. Copy the **Property ID** number (it's just a number like `123456789`)

## Step 3: Add Service Account to GA4

1. Still in **Admin** → **Property** column
2. Click **"Property access management"**
3. Click the blue **"+"** button → **"Add users"**
4. **Email address:** `analytics-reader@zeropoint-labs-analytics.iam.gserviceaccount.com`
5. **Role:** Select **"Viewer"**
6. **Notify new users via email:** Uncheck this
7. Click **"Add"**

## Step 4: Update the Property ID

In your `.env.local` file, replace `YOUR_PROPERTY_ID_HERE` with your actual Property ID (just the number, no quotes).

## Step 5: Test

1. Restart your dev server: `npm run dev`
2. Visit your admin dashboard
3. Check browser console for: `"✅ Using real GA4 data for analytics dashboard"`

## Important Notes

- The JSON key must be all on **one line** with no line breaks
- Don't add extra quotes around the JSON
- The Property ID is just numbers, no G- prefix
- Make sure the service account email is added to your GA4 property

## If you see errors:

- **"Unexpected token"**: The JSON formatting is wrong
- **"Property not found"**: Wrong Property ID or missing permissions
- **"Access denied"**: Service account not added to GA4 property

Once set up correctly, you'll see real analytics data instead of demo data! 🎉 