import { TestimonialProps, ServiceProps, ProjectProps } from '@/types';

// Sample testimonials data
export const testimonials: TestimonialProps[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Homeowner',
    company: 'Downtown Condo',
    content:
      'Elite Renovations transformed our outdated kitchen into a modern masterpiece. The attention to detail and quality of work exceeded our expectations. Completed in just 28 days!',
    rating: 5,
    image: '/images/testimonials/sarah.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Property Manager',
    company: 'Luxury Apartments',
    content:
      'Working with Elite Renovations on multiple units has been fantastic. Their team is professional, efficient, and delivers consistent high-quality results every time.',
    rating: 5,
    image: '/images/testimonials/michael.jpg',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Interior Designer',
    company: 'Design Studio',
    content:
      'I regularly recommend Elite Renovations to my clients. Their craftsmanship and ability to bring design visions to life is unmatched in the industry.',
    rating: 5,
    image: '/images/testimonials/emily.jpg',
  },
];

// Sample services data
export const services: ServiceProps[] = [
  {
    id: 'kitchen',
    title: 'Kitchen Renovations',
    description:
      'Complete kitchen transformations with modern appliances, custom cabinetry, and stunning countertops.',
    icon: 'ChefHat',
    features: [
      'Custom cabinet design',
      'Premium countertops',
      'Modern appliance installation',
      'Lighting design',
      'Plumbing updates',
    ],
    price: 'Starting at $25,000',
  },
  {
    id: 'bathroom',
    title: 'Bathroom Remodeling',
    description:
      'Luxury bathroom makeovers featuring spa-like amenities and premium finishes.',
    icon: 'Bath',
    features: [
      'Walk-in showers',
      'Luxury fixtures',
      'Heated flooring',
      'Custom vanities',
      'Smart mirrors',
    ],
    price: 'Starting at $15,000',
  },
  {
    id: 'living',
    title: 'Living Room Makeovers',
    description:
      'Transform your living space into an elegant and functional area for relaxation and entertainment.',
    icon: 'Sofa',
    features: [
      'Open floor plans',
      'Built-in storage',
      'Fireplace installation',
      'Lighting systems',
      'Flooring upgrades',
    ],
    price: 'Starting at $20,000',
  },
  {
    id: 'bedroom',
    title: 'Bedroom Transformations',
    description:
      'Create your perfect sanctuary with custom closets, lighting, and luxurious finishes.',
    icon: 'Bed',
    features: [
      'Walk-in closets',
      'Custom built-ins',
      'Ambient lighting',
      'Premium flooring',
      'Window treatments',
    ],
    price: 'Starting at $12,000',
  },
];

// Sample project portfolio data
export const projects: ProjectProps[] = [
  {
    id: 'modern-kitchen',
    title: 'Modern Kitchen Transformation',
    description:
      'Complete kitchen renovation featuring quartz countertops, custom cabinets, and premium appliances.',
    category: 'Kitchen',
    beforeImage: '/images/projects/kitchen-before-1.jpg',
    afterImage: '/images/projects/kitchen-after-1.jpg',
    completionTime: '25 days',
    tags: ['Modern', 'Quartz', 'Custom Cabinets'],
  },
  {
    id: 'luxury-bathroom',
    title: 'Luxury Master Bathroom',
    description:
      'Spa-like bathroom renovation with walk-in shower, heated floors, and premium fixtures.',
    category: 'Bathroom',
    beforeImage: '/images/projects/bathroom-before-1.jpg',
    afterImage: '/images/projects/bathroom-after-1.jpg',
    completionTime: '18 days',
    tags: ['Luxury', 'Spa', 'Heated Floors'],
  },
  {
    id: 'open-living',
    title: 'Open Concept Living Space',
    description:
      'Transformed closed-off rooms into an open, airy living space perfect for entertaining.',
    category: 'Living Room',
    beforeImage: '/images/projects/living-before-1.jpg',
    afterImage: '/images/projects/living-after-1.jpg',
    completionTime: '30 days',
    tags: ['Open Concept', 'Entertainment', 'Modern'],
  },
  {
    id: 'master-bedroom',
    title: 'Master Bedroom Suite',
    description:
      'Complete bedroom makeover with walk-in closet, custom built-ins, and luxury finishes.',
    category: 'Bedroom',
    beforeImage: '/images/projects/bedroom-before-1.jpg',
    afterImage: '/images/projects/bedroom-after-1.jpg',
    completionTime: '22 days',
    tags: ['Suite', 'Walk-in Closet', 'Luxury'],
  },
];

// FAQ data
export const faqs = [
  {
    id: '1',
    question: 'How long does a typical renovation take?',
    answer:
      'Most of our renovations are completed within 30 days. Kitchen renovations typically take 3-4 weeks, bathrooms 2-3 weeks, and living spaces 3-5 weeks depending on the scope of work.',
  },
  {
    id: '2',
    question: 'Do you provide design services?',
    answer:
      'Yes! Our team includes experienced designers who work with you to create the perfect space. We provide 3D renderings and detailed plans before starting any work.',
  },
  {
    id: '3',
    question: 'What is included in your warranty?',
    answer:
      'We provide a comprehensive 5-year warranty on all structural work and a 2-year warranty on fixtures and finishes. Our warranty covers both materials and labor.',
  },
  {
    id: '4',
    question: 'How do you handle permits and inspections?',
    answer:
      'We handle all necessary permits and coordinate inspections as part of our service. Our team is familiar with local building codes and ensures all work meets or exceeds requirements.',
  },
  {
    id: '5',
    question: 'Can you work within my budget?',
    answer:
      'Absolutely! We offer solutions for various budgets and will work with you to prioritize features that matter most to you. We provide detailed estimates upfront with no hidden costs.',
  },
];

// Process steps
export const processSteps = [
  {
    id: '1',
    title: 'Consultation',
    description:
      'Free in-home consultation to discuss your vision and assess the space.',
    icon: 'MessageCircle',
    duration: '1 day',
  },
  {
    id: '2',
    title: 'Design & Planning',
    description:
      '3D renderings and detailed project planning with timeline and budget.',
    icon: 'PenTool',
    duration: '3-5 days',
  },
  {
    id: '3',
    title: 'Permits & Preparation',
    description:
      'Securing permits and preparing the space for renovation work.',
    icon: 'FileText',
    duration: '5-7 days',
  },
  {
    id: '4',
    title: 'Construction',
    description: 'Professional renovation work with daily progress updates.',
    icon: 'Hammer',
    duration: '15-25 days',
  },
  {
    id: '5',
    title: 'Final Inspection',
    description: 'Quality check, final touches, and walkthrough with you.',
    icon: 'CheckCircle',
    duration: '1-2 days',
  },
];
