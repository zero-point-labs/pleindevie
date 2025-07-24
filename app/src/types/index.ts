// Common types for the landing page
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface TestimonialProps {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price?: string;
}

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  completionTime: string;
  tags: string[];
}

export interface FormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}

export interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration: number;
      delay?: number;
      ease?: string;
    };
  };
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'lead_form_view' | 'lead_form_submit' | 'section_view' | 'button_click';
  timestamp: string;
  sessionId: string;
  data: {
    page?: string;
    section?: string;
    buttonText?: string;
    userAgent?: string;
    referrer?: string;
    ip?: string;
    viewport?: {
      width: number;
      height: number;
    };
    // Lead-specific data
    projectType?: string;
    budget?: string;
    timeline?: string;
  };
}

export interface AnalyticsSession {
  id: string;
  startTime: string;
  lastActivity: string;
  pageViews: number;
  events: string[]; // Event IDs
  userAgent: string;
  referrer: string;
  ip?: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  totalLeads: number;
  conversionRate: number;
  thisMonth: {
    pageViews: number;
    leads: number;
    visitors: number;
  };
  topProjectTypes: Array<{
    type: string;
    count: number;
  }>;
  topBudgets: Array<{
    budget: string;
    count: number;
  }>;
  dailyStats: Array<{
    date: string;
    pageViews: number;
    leads: number;
    visitors: number;
  }>;
}
