# 🏠 Renovation Landing Page with Appwrite & n8n

A modern, professional landing page for renovation services with integrated lead management system powered by Appwrite database and n8n automation.

## ✨ Features

- **Modern Landing Page**: Beautiful, responsive design with smooth animations
- **Lead Capture Form**: Professional form with validation and user feedback
- **Admin Dashboard**: Real-time lead management with status updates
- **Cloud Database**: Appwrite integration for scalable data storage
- **Automation**: n8n workflow integration for lead processing
- **Analytics**: Built-in tracking and reporting capabilities
- **Fallback Systems**: Robust error handling and fallback mechanisms

## 🚀 Quick Start (Automated Setup)

### Prerequisites
- Node.js installed
- Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))
- n8n running locally or in cloud

### 1. Install Dependencies
```bash
npm install
```

### 2. Automated Appwrite Setup
Run our automated setup script that creates everything for you:

```bash
npm run setup:appwrite
```

This script will:
- ✅ Create database and collection
- ✅ Set up all required attributes
- ✅ Configure permissions and indexes
- ✅ Generate `.env.local` file

### 3. Validate Setup
```bash
npm run validate:setup
```

### 4. Set Up n8n Workflow
1. Open n8n (http://localhost:5678)
2. Create workflow: Webhook → HTTP Request
3. Point HTTP Request to: `http://localhost:3000/api/webhooks/n8n`
4. Add webhook URL to `.env.local`

### 5. Start Development
```bash
npm run dev
```

### 6. Test Integration
```bash
npm run test:webhook
```

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/
│   │   ├── leads/               # Original leads API
│   │   ├── leads/appwrite/      # Appwrite leads API
│   │   └── webhooks/n8n/        # n8n webhook endpoint
│   ├── admin/                   # Admin dashboard
│   └── page.tsx                 # Landing page
├── src/
│   ├── components/
│   │   ├── sections/            # Landing page sections
│   │   ├── admin/               # Admin components
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── appwrite.ts          # Appwrite configuration
│   │   ├── utils.ts             # Utility functions
│   │   └── validation.ts        # Form validation schemas
│   └── types/                   # TypeScript types
├── scripts/
│   ├── setup-appwrite.mjs       # Automated setup script
│   ├── validate-setup.mjs       # Setup validation
│   └── test-webhook.js          # Webhook testing
└── docs/                        # Documentation
    ├── QUICK_START.md           # Quick start guide
    ├── APPWRITE_N8N_SETUP.md    # Detailed setup
    └── INTEGRATION_SUMMARY.md   # Complete overview
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Setup & Testing
npm run setup:appwrite      # Automated Appwrite setup
npm run validate:setup      # Validate setup configuration
npm run test:webhook        # Test webhook integration

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
npm run type-check         # TypeScript type checking
```

## 🗄️ Database Schema

The Appwrite collection includes these attributes:
- `name` (String) - Lead's full name
- `email` (String) - Email address
- `phone` (String) - Phone number
- `projectType` (Enum) - Kitchen, Bathroom, Whole Home, etc.
- `budget` (Enum) - Budget range
- `timeline` (Enum) - Project timeline
- `message` (String, optional) - Additional details
- `termsAccepted` (Boolean) - Terms acceptance
- `marketingConsent` (Boolean) - Marketing consent
- `status` (Enum) - new, contacted, qualified, closed
- `timestamp` (String) - Submission timestamp

## 🔄 Data Flow

1. **User submits form** → Validates with Zod schema
2. **Form sends to n8n** → Webhook processes data
3. **n8n forwards to API** → `/api/webhooks/n8n`
4. **API stores in Appwrite** → Cloud database
5. **Admin panel fetches** → Real-time updates

## 🛡️ Fallback Systems

- **No n8n URL**: Falls back to direct API submission
- **Appwrite unavailable**: Admin panel uses local storage API
- **Network issues**: Comprehensive error handling
- **Validation failures**: User-friendly error messages

## 📊 Admin Features

- **Lead Management**: View, filter, and update lead status
- **Real-time Updates**: Status changes sync immediately
- **Analytics Dashboard**: Track submissions and conversions
- **Export Capabilities**: Download lead data
- **Responsive Design**: Works on all devices

## 🌐 Environment Variables

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID=your_collection_id

# n8n Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-id

# Optional Services
WEBHOOK_URL=
EMAIL_SERVICE_URL=
ADMIN_EMAIL=admin@example.com
```

## 🚀 Production Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Add environment variables in Vercel dashboard
# Update n8n webhook URL to production domain
```

### Other Platforms
1. Build the project: `npm run build`
2. Set environment variables
3. Configure n8n for production
4. Deploy static files

## 📖 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 10 minutes
- **[Setup Guide](docs/APPWRITE_N8N_SETUP.md)** - Detailed configuration
- **[Integration Summary](docs/INTEGRATION_SUMMARY.md)** - Complete overview

## 🧪 Testing

### Manual Testing
1. Fill out the form on the landing page
2. Check admin panel for new lead
3. Update lead status and verify changes

### Automated Testing
```bash
# Test webhook endpoint
npm run test:webhook

# Validate complete setup
npm run validate:setup
```

### API Testing
```bash
# Test Appwrite endpoint
curl http://localhost:3000/api/leads/appwrite

# Test webhook manually
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Appwrite Cloud
- **Automation**: n8n
- **Forms**: React Hook Form, Zod validation
- **UI Components**: Radix UI, Custom components
- **Analytics**: Google Analytics integration

## 🔧 Troubleshooting

### Common Issues

**Form not submitting**
- Check n8n webhook URL in `.env.local`
- Verify n8n workflow is active
- Check browser console for errors

**Admin panel empty**
- Validate Appwrite connection: `npm run validate:setup`
- Check environment variables
- Verify Appwrite permissions

**Setup script fails**
- Ensure API key has correct permissions
- Check internet connection
- Verify project ID is correct

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for modern lead management**
