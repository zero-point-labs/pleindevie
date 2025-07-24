import { z } from 'zod';

// Lead capture form schema
export const leadCaptureFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes' 
    }),
  
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be less than 100 characters' }),
  
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be less than 15 digits' })
    .regex(/^[\+]?[1-9][\d]{0,15}$/, { 
      message: 'Please enter a valid phone number' 
    }),
  
  projectType: z.enum(['Kitchen', 'Bathroom', 'Whole Home', 'Living Room', 'Basement', 'Other'], {
    message: 'Please select a project type'
  }),
  
  budget: z.enum(['$25k-$50k', '$50k-$100k', '$100k-$200k', '$200k+', 'Not Sure'], {
    message: 'Please select a budget range'
  }),
  
  timeline: z.enum(['ASAP', '1-3 months', '3-6 months', '6+ months', 'Just exploring'], {
    message: 'Please select a timeline'
  }),
  
  message: z
    .string()
    .max(500, { message: 'Message must be less than 500 characters' })
    .optional(),
  
  termsAccepted: z
    .boolean()
    .refine(val => val === true, {
      message: 'You must accept the terms and conditions to proceed'
    }),
  
  marketingConsent: z.boolean().optional(),
});

// Infer the TypeScript type from the schema
export type LeadCaptureFormData = z.infer<typeof leadCaptureFormSchema>;

// Default values for the form
export const leadCaptureFormDefaults: LeadCaptureFormData = {
  name: '',
  email: '',
  phone: '',
  projectType: 'Kitchen',
  budget: 'Not Sure',
  timeline: 'Just exploring',
  message: '',
  termsAccepted: false,
  marketingConsent: false,
};

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  
  // For international numbers, just return with spaces
  if (cleanPhone.length > 10) {
    return cleanPhone.replace(/(\d{1,3})(\d{3})(\d{3,4})/, '$1 $2 $3');
  }
  
  return phone;
};

// Form field configurations
export const projectTypeOptions = [
  { value: 'Kitchen', label: 'Kitchen Renovation' },
  { value: 'Bathroom', label: 'Bathroom Renovation' },
  { value: 'Whole Home', label: 'Whole Home Renovation' },
  { value: 'Living Room', label: 'Living Room Renovation' },
  { value: 'Basement', label: 'Basement Renovation' },
  { value: 'Other', label: 'Other Project' },
] as const;

export const budgetOptions = [
  { value: '$25k-$50k', label: '$25,000 - $50,000' },
  { value: '$50k-$100k', label: '$50,000 - $100,000' },
  { value: '$100k-$200k', label: '$100,000 - $200,000' },
  { value: '$200k+', label: '$200,000+' },
  { value: 'Not Sure', label: 'Not Sure Yet' },
] as const;

export const timelineOptions = [
  { value: 'ASAP', label: 'As Soon As Possible' },
  { value: '1-3 months', label: '1-3 Months' },
  { value: '3-6 months', label: '3-6 Months' },
  { value: '6+ months', label: '6+ Months' },
  { value: 'Just exploring', label: 'Just Exploring Options' },
] as const;

// Error messages for common validation scenarios
export const validationMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  termsRequired: 'You must accept the terms and conditions',
  nameTooShort: 'Name must be at least 2 characters',
  nameTooLong: 'Name is too long',
  messageTooLong: 'Message is too long (max 500 characters)',
} as const;
