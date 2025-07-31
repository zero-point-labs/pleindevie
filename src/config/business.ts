// Business Configuration System - REMOVED
// 
// This file previously contained a configuration system for switching
// between different business types (renovation, landscaping, plumbing).
// 
// It has been removed in favor of hardcoded values directly in components:
// - Hero content: src/components/sections/Hero.tsx
// - Form options: src/lib/validation.ts  
// - SEO metadata: app/layout.tsx
// - Privacy contact: app/privacy-policy/page.tsx
//
// To customize for a new client:
// 1. Edit Hero.tsx for headlines and copy
// 2. Edit validation.ts for form project types/budgets/timelines
// 3. Edit layout.tsx for page title and description
// 4. Edit privacy-policy/page.tsx for contact email
// 5. Replace images in /public/ folder
//
// This approach gives you direct control over each component
// without any abstraction layers.

export {}; // Keep file for reference 