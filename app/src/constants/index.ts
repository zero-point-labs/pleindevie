// Brand colors and design tokens
export const BRAND_COLORS = {
  gold: '#D4AF37',
  goldLight: '#E6C866',
  goldDark: '#B8941F',
  navy: '#1A2B4C',
  navyLight: '#2A3B5C',
  navyDark: '#0F1A2F',
} as const;

// Animation configurations
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

export const ANIMATION_EASE = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Company information
export const COMPANY_INFO = {
  name: 'Elite Renovations',
  tagline: 'Transform Your Space, Elevate Your Life',
  phone: '+1 (555) 123-4567',
  email: 'hello@eliterenovations.com',
  address: '123 Design Street, City, State 12345',
  socialMedia: {
    instagram: 'https://instagram.com/eliterenovations',
    facebook: 'https://facebook.com/eliterenovations',
    linkedin: 'https://linkedin.com/company/eliterenovations',
  },
} as const;

// Services offered
export const SERVICES = [
  'Kitchen Renovations',
  'Bathroom Remodeling',
  'Living Room Makeovers',
  'Bedroom Transformations',
  'Home Office Design',
  'Outdoor Spaces',
] as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
} as const;

// API endpoints (if needed)
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  quote: '/api/quote',
} as const;

// SEO constants
export const SEO = {
  title: 'Elite Renovations - Transform Your Space, Elevate Your Life',
  description:
    'Professional home renovation services that transform your space in 30 days. Kitchen, bathroom, and living space makeovers with guaranteed results.',
  keywords:
    'home renovation, kitchen remodel, bathroom renovation, interior design, home improvement',
  ogImage: '/images/og-image.jpg',
} as const;
