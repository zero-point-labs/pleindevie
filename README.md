# Renovation Landing Page Template

A complete, production-ready landing page template for renovation businesses with lead capture, admin dashboard, and analytics.

## ✨ Features

- **🎨 Modern Landing Page** - Hero section with before/after slider, lead capture form
- **📊 Admin Dashboard** - Lead management with status tracking and analytics
- **🔐 Authentication** - Secure admin login via Appwrite
- **📈 Analytics** - Google Analytics 4 with GDPR-compliant cookie consent
- **💾 Data Storage** - Lead storage in Appwrite database with Redis caching
- **🚀 Production Ready** - Optimized for 1K-10K monthly visitors

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Appwrite Cloud
- **Analytics**: Google Analytics 4 with consent management
- **Caching**: Redis (Vercel integration)
- **Hosting**: Vercel
- **UI Components**: Radix UI, Framer Motion

## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   git clone <repo-url> my-client-site
   cd my-client-site
   npm install
   ```

2. **Set up services**:
   - Create [Appwrite](https://cloud.appwrite.io) project
   - Set up [Google Analytics 4](https://analytics.google.com)
   - Deploy to [Vercel](https://vercel.com)

3. **Configure environment**:
   ```bash
   cp env.example.txt .env.local
   # Update with your service credentials
   npm run setup:appwrite  # Auto-create database
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## 📖 Full Setup Guide

For complete step-by-step instructions, see **[SETUP.md](./SETUP.md)**.

## 🎯 Perfect For

- Renovation contractors
- Home improvement services  
- Construction companies
- Interior designers
- Any business needing lead capture with admin management

## 📱 What's Included

### Landing Page
- Hero section with compelling copy
- Before/after image comparison slider
- Lead capture form with validation
- GDPR-compliant cookie consent
- Mobile-responsive design

### Admin Dashboard (`/admin`)
- Secure login system
- Lead management table
- Status tracking (new, contacted, qualified, closed)
- Analytics overview with charts
- Export capabilities

### Analytics & Compliance
- Google Analytics 4 integration
- Cookie consent management
- Privacy policy page
- GDPR compliance
- Redis-cached analytics for performance

## 🔧 Customization

Key files to customize for each client:

```bash
src/components/sections/Hero.tsx          # Main copy and CTAs
src/components/sections/LeadCaptureForm.tsx  # Form fields
public/before.jpg, public/after.jpg      # Before/after images
app/globals.css                          # Brand colors
app/layout.tsx                           # Site title and meta
```

## 📊 Performance

- **Load time**: < 2 seconds
- **Lighthouse score**: 95+ on all metrics
- **Capacity**: 1,000-10,000 monthly visitors
- **Caching**: Redis-optimized analytics
- **CDN**: Vercel Edge Network

## 🛡️ Security

- Environment variables for all secrets
- Security headers configured
- GDPR-compliant data handling
- Secure authentication via Appwrite
- Input validation and sanitization

## 📞 Support

- **Setup issues**: Check [SETUP.md](./SETUP.md)
- **Common problems**: See troubleshooting section in setup guide
- **Feature requests**: Create an issue

## 📄 License

This template is available for commercial use. See license terms for details.

---

Made with ❤️ for efficient client onboarding and professional lead generation.
