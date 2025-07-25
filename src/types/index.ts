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
    // Lead-specific data (minimal)
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

// Enhanced analytics for demographics and behavior
export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  count: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
}

export interface GeographicData {
  country: string;
  city?: string;
  visitors: number;
  percentage: number;
}

export interface PagePerformance {
  page: string;
  views: number;
  avgTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
}

export interface UserBehavior {
  avgSessionDuration: number;
  avgPagesPerSession: number;
  newVisitorsPercentage: number;
  returningVisitorsPercentage: number;
  bounceRate: number;
}

export interface RealTimeData {
  activeUsers: number;
  topPages: Array<{ page: string; users: number }>;
  topCountries: Array<{ country: string; users: number }>;
  recentEvents: Array<{ event: string; timestamp: string; page: string }>;
}

export interface AnalyticsSummary {
  // Core metrics
  totalPageViews: number;
  uniqueVisitors: number;
  totalSessions: number;
  
  // User behavior insights
  userBehavior: UserBehavior;
  
  // Traffic analysis
  trafficSources: TrafficSource[];
  topPages: PagePerformance[];
  
  // Demographics & technology
  deviceBreakdown: DeviceInfo[];
  topBrowsers: Array<{ browser: string; count: number; percentage: number }>;
  
  // Geographic insights
  topCountries: GeographicData[];
  topCities: GeographicData[];
  
  // Time-based analytics
  dailyStats: Array<{
    date: string;
    pageViews: number;
    visitors: number;
    sessions: number;
    avgSessionDuration: number;
  }>;
  
  hourlyPattern: Array<{
    hour: number;
    visitors: number;
    activity: 'low' | 'medium' | 'high';
  }>;
  
  // Real-time data
  realTime?: RealTimeData;
  
  // Minimal lead data (kept simple)
  totalLeads: number;
  conversionRate: number;
  topProjectTypes?: Array<{
    type: string;
    count: number;
  }>;
}
