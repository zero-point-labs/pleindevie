# Landing Page Template Setup Guide

This guide walks you through cloning, configuring, and deploying this renovation landing page template for a new client.

## 🚀 Quick Overview

This template includes:
- **Landing page** with hero section, before/after slider, and lead capture form
- **Admin dashboard** with lead management and analytics
- **Authentication** via Appwrite
- **Analytics** with Google Analytics 4 + GDPR compliance
- **Lead storage** in Appwrite database
- **Caching** with Redis for analytics performance

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Git configured
- Access to create accounts on:
  - [Vercel](https://vercel.com) (hosting)
  - [Appwrite Cloud](https://cloud.appwrite.io) (auth & database)
  - [Google Analytics](https://analytics.google.com) (tracking)
  - [Google Cloud Platform](https://console.cloud.google.com) (GA4 API access)

## 🔧 Step 1: Clone and Initial Setup

```bash
# Clone the repository
git clone <your-template-repo-url> client-landing-page
cd client-landing-page

# Install dependencies
npm install

# Copy environment template
cp env.example.txt .env.local
```

## 🏗️ Step 2: Appwrite Setup

### 2.1 Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Note down your:
   - **Project ID** (from project settings)
   - **API Endpoint** (usually `https://cloud.appwrite.io/v1`)

### 2.2 Generate API Key

1. In your Appwrite project, go to **Settings** → **API Keys**
2. Create a new API key with these scopes:
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
3. Copy the generated API key

### 2.3 Auto-Setup Database

Update your `.env.local` with Appwrite details:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
```

Run the automated setup script:

```bash
npm run setup:appwrite
```

This will:
- Create a database and leads collection
- Set up all required attributes and indexes
- Update your `.env.local` with the database/collection IDs
- Configure proper permissions

### 2.4 Create Admin User

1. In Appwrite Console, go to **Auth** → **Users**
2. Create a new user with email/password
3. Note the credentials for admin login

## 📊 Step 3: Google Analytics Setup

### 3.1 Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new account/property
3. Set up a **Web** data stream
4. Note your **Measurement ID** (format: `G-XXXXXXXXX`)

### 3.2 Enable GA4 Reporting API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google Analytics Reporting API**
4. Go to **Credentials** → **Create Credentials** → **Service Account**
5. Download the JSON key file
6. In GA4, go to **Admin** → **Property Access Management**
7. Add the service account email as a **Viewer**

### 3.3 Configure Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX
GA4_PROPERTY_ID=123456789
GA4_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

> **Note**: The `GA4_SERVICE_ACCOUNT_KEY` should be the entire JSON content as a single line.

## 🚀 Step 4: Vercel Deployment

### 4.1 Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy (follow prompts)
vercel

# Or connect via Vercel dashboard by importing your Git repository
```

### 4.2 Add Redis Integration

1. In Vercel dashboard, go to your project
2. Navigate to **Integrations** tab
3. Add **Redis** integration
4. Create a new Redis store
5. The integration will automatically add `REDIS_URL` and `REDIS_TOKEN` environment variables

### 4.3 Configure Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add all variables from your `.env.local`:

**Required variables:**
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- `NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID`
- `NEXT_PUBLIC_GA_ID`
- `GA4_PROPERTY_ID`
- `GA4_SERVICE_ACCOUNT_KEY`

**Auto-added by integrations:**
- `REDIS_URL` (from Redis integration)
- `REDIS_TOKEN` (from Redis integration)

### 4.4 Set Custom Domain

1. In Vercel dashboard → **Settings** → **Domains**
2. Add your client's custom domain
3. Configure DNS records as instructed
4. Enable SSL (automatic)

## ✅ Step 5: Testing & Validation

### 5.1 Test the Application

```bash
# Run locally to test
npm run dev

# Validate setup
npm run validate:setup
```

### 5.2 Verify Features

1. **Landing page**: Visit the home page, test form submission
2. **Admin login**: Go to `/admin`, log in with Appwrite credentials
3. **Analytics**: Check that GA4 events are firing (use GA4 Realtime reports)
4. **Privacy compliance**: Test cookie banner and consent withdrawal

### 5.3 Test Lead Flow

1. Submit a test lead via the contact form
2. Check Appwrite database for the new document
3. Verify it appears in the admin dashboard
4. Test lead status updates

## 🎨 Step 6: Customization for Client

### 6.1 Branding Updates

Key files to customize:

```bash
# Text content and copy
src/components/sections/Hero.tsx         # Main headline, CTA buttons
src/components/sections/LeadCaptureForm.tsx  # Form title and fields

# Styling and colors
app/globals.css                          # CSS custom properties
tailwind.config.js                       # Tailwind theme customization

# Images
public/before.jpg                        # Before renovation image
public/after.jpg                         # After renovation image
public/favicon.ico                       # Site favicon

# Metadata
app/layout.tsx                           # Page title and description
app/page.tsx                             # OpenGraph tags (if added)
```

### 6.2 Contact Information

Update contact details in:
- Footer links
- Form submission success messages
- Privacy policy contact email
- Admin dashboard branding

### 6.3 Legal Pages

Customize the privacy policy:
```bash
app/privacy-policy/page.tsx              # Update company name, contact details
```

## 🔒 Step 7: Security & Go-Live

### 7.1 Security Checklist

- [ ] Remove any test/placeholder data from Appwrite
- [ ] Verify all environment variables are set in production
- [ ] Test GDPR compliance (cookie banner, consent withdrawal)
- [ ] Ensure admin credentials are secure and client-specific
- [ ] Verify analytics are tracking correctly

### 7.2 Performance Optimization

The template includes:
- ✅ Redis caching for analytics
- ✅ Next.js Image optimization
- ✅ Static asset optimization
- ✅ Security headers
- ✅ Proper error boundaries

### 7.3 Monitoring

Set up monitoring:
1. **Vercel Analytics**: Automatically enabled
2. **Google Analytics**: Check GA4 dashboard
3. **Appwrite Monitoring**: Check database usage
4. **Redis Usage**: Monitor via Vercel dashboard

## 📞 Support & Maintenance

### Common Issues

**Form submissions not appearing in admin:**
- Check Appwrite database permissions
- Verify collection ID in environment variables
- Check browser console for errors

**Analytics not tracking:**
- Verify GA4 Measurement ID is correct
- Check that users are accepting cookies
- Use GA4 DebugView for troubleshooting

**Admin login fails:**
- Verify Appwrite project ID and endpoint
- Check that admin user exists in Appwrite Auth
- Ensure Auth service is enabled in Appwrite

### Client Handover

Provide the client with:
1. **Admin login credentials**
2. **Vercel dashboard access** (optional)
3. **Google Analytics access**
4. **Basic admin training** (lead management, status updates)

## 🎯 Expected Traffic Capacity

This setup can handle:
- **1,000-10,000 monthly visitors** comfortably
- **Concurrent users**: 100+ 
- **Form submissions**: Unlimited (within Appwrite plan limits)
- **Analytics calls**: Optimized with Redis caching

For higher traffic, consider upgrading Vercel and Appwrite plans.

---

## 📝 Quick Reference

### Useful Commands

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run setup:appwrite  # Initialize Appwrite database
npm run validate:setup  # Verify configuration
npm run test:webhook    # Test webhook integration
```

### Important URLs

- **Production site**: `https://your-domain.com`
- **Admin dashboard**: `https://your-domain.com/admin`
- **Privacy policy**: `https://your-domain.com/privacy-policy`

### Support Contacts

- **Template issues**: [Your support email]
- **Hosting (Vercel)**: Vercel support
- **Database (Appwrite)**: Appwrite documentation
- **Analytics**: Google Analytics Help Center 