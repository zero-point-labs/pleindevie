'use client';

import { useEffect, useRef, useCallback } from 'react';

interface TrackEventData {
  page?: string;
  section?: string;
  buttonText?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  viewport?: {
    width: number;
    height: number;
  };
  // Universal tracking parameters
  scrollDepth?: number;
  timeOnPage?: number;
  deviceType?: string;
  contactIntent?: 'high' | 'medium' | 'low';
  engagementLevel?: 'high' | 'medium' | 'low';
  sessionDepth?: number;
}

interface UseAnalyticsReturn {
  trackEvent: (type: string, data?: TrackEventData) => Promise<void>;
  trackPageView: (page?: string) => Promise<void>;
  trackFormView: () => Promise<void>;
  trackFormSubmit: (data?: TrackEventData) => Promise<void>;
  trackSectionView: (section: string) => Promise<void>;
  trackButtonClick: (buttonText: string) => Promise<void>;
  trackScrollDepth: (depth: number) => Promise<void>;
  trackTimeOnPage: (seconds: number) => Promise<void>;
  trackContactIntent: (method: string, intent: 'high' | 'medium' | 'low') => Promise<void>;
  trackDeviceInteraction: (interaction: string) => Promise<void>;
  trackFormInteraction: (field: string, action: 'focus' | 'blur' | 'complete' | 'abandon') => Promise<void>;
  trackExitIntent: () => Promise<void>;
  sessionId: string;
}

// Google Analytics 4 helper functions
const initGA4 = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    // Initialize GA4 if not already done
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(...args: unknown[]) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        // Configure for privacy and performance
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
        // Enable all automatic demographics and interest reporting
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
      });
    }
  }
};

const trackGA4Event = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', eventName, {
      ...parameters,
      // Universal parameters for any business
      timestamp: new Date().toISOString(),
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

const trackGA4PageView = (page: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: page,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Universal helper functions
const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {};
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const isMobile = viewport.width <= 768;
  const isTablet = viewport.width > 768 && viewport.width <= 1024;
  const isDesktop = viewport.width > 1024;
  
  return {
    viewport,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
  };
};

const getEngagementLevel = (timeOnPage: number, interactions: number): 'high' | 'medium' | 'low' => {
  if (timeOnPage > 120 && interactions > 3) return 'high'; // 2+ minutes, 3+ interactions
  if (timeOnPage > 60 && interactions > 1) return 'medium'; // 1+ minute, 1+ interaction  
  return 'low';
};

const getContactIntent = (eventType: string, timeOnPage: number): 'high' | 'medium' | 'low' => {
  if (eventType.includes('phone') || eventType.includes('call')) return 'high';
  if (eventType.includes('form') && timeOnPage > 60) return 'high';
  if (eventType.includes('email') || eventType.includes('contact')) return 'medium';
  return 'low';
};

export function useAnalytics(): UseAnalyticsReturn {
  const sessionIdRef = useRef<string>('');
  const lastTrackTime = useRef<{ [key: string]: number }>({});
  const pageStartTime = useRef<number>(Date.now());
  const interactionCount = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);
  const exitIntentTracked = useRef<boolean>(false);

  const getViewportSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const getReferrer = () => {
    if (typeof document !== 'undefined') {
      return document.referrer || 'direct';
    }
    return 'direct';
  };

  const trackEvent = useCallback(async (type: string, data: TrackEventData = {}): Promise<void> => {
    if (!sessionIdRef.current) return;

    // Check if user has consented to analytics
    const consent = localStorage.getItem('analytics_consent');
    if (consent === 'declined') return;

    // Prevent duplicate tracking within 2 seconds for the same event type
    const eventKey = `${type}_${data.section || data.page || ''}`;
    const now = Date.now();
    if (lastTrackTime.current[eventKey] && now - lastTrackTime.current[eventKey] < 2000) {
      return;
    }
    lastTrackTime.current[eventKey] = now;

    // Increment interaction count for engagement tracking
    if (!['page_view', 'time_on_page', 'scroll_depth'].includes(type)) {
      interactionCount.current += 1;
    }

    try {
      const deviceInfo = getDeviceInfo();
      const timeOnPage = Math.floor((now - pageStartTime.current) / 1000);
      const engagementLevel = getEngagementLevel(timeOnPage, interactionCount.current);
      const contactIntent = getContactIntent(type, timeOnPage);

      const eventData = {
        ...data,
        referrer: getReferrer(),
        viewport: getViewportSize(),
        timeOnPage,
        engagementLevel,
        contactIntent,
        deviceInfo,
        sessionDepth: interactionCount.current,
        maxScrollDepth: maxScrollDepth.current,
      };

      // Track to both custom analytics and GA4
      await Promise.all([
        // Custom analytics (existing)
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            sessionId: sessionIdRef.current,
            data: eventData
          })
        }),
        
        // Google Analytics 4 (enhanced universal tracking)
        Promise.resolve(trackGA4Event(type, {
          event_category: getEventCategory(type),
          event_label: data.section || data.buttonText || '',
          
          // Universal custom dimensions
          custom_engagement_level: engagementLevel,
          custom_device_type: deviceInfo.deviceType,
          custom_contact_intent: contactIntent,
          custom_session_depth: interactionCount.current,
          custom_time_on_page: timeOnPage,
          custom_scroll_depth: maxScrollDepth.current,
          
          // Standard GA4 parameters
          session_id: sessionIdRef.current,
          page_path: data.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
          
          // Device and technical data
          screen_resolution: deviceInfo.screenResolution,
          viewport_size: deviceInfo.viewport ? `${deviceInfo.viewport.width}x${deviceInfo.viewport.height}` : 'unknown',
          
          // Engagement metrics
          engagement_time_msec: timeOnPage * 1000,
          
          // Custom business-agnostic parameters
          user_engagement: engagementLevel,
          device_category: deviceInfo.deviceType,
        }))
      ]);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, []);

  // Helper function to categorize events for better GA4 organization
  const getEventCategory = (type: string): string => {
    switch (type) {
      case 'page_view':
        return 'Navigation';
      case 'lead_form_view':
      case 'lead_form_submit':
      case 'form_interaction':
        return 'Lead Generation';
      case 'section_view':
      case 'scroll_depth':
      case 'time_on_page':
        return 'Engagement';
      case 'button_click':
      case 'contact_intent':
      case 'device_interaction':
        return 'User Interaction';
      case 'exit_intent':
        return 'User Behavior';
      default:
        return 'General';
    }
  };

  // Initialize GA4 and session tracking
  useEffect(() => {
    // Initialize GA4
    initGA4();

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;

    // Reset page tracking
    pageStartTime.current = Date.now();
    interactionCount.current = 0;
    maxScrollDepth.current = 0;
    exitIntentTracked.current = false;

    // Track initial page view
    const trackInitialPageView = async () => {
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';
      await trackEvent('page_view', { page: currentPage });
      trackGA4PageView(currentPage);
    };
    
    trackInitialPageView();

    // Set up universal tracking listeners
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          trackEvent('scroll_depth', { scrollDepth: scrollPercent });
        }
      }
    };

    // Time-based tracking
    const timeTrackers = [
      setTimeout(() => trackEvent('time_on_page', { timeOnPage: 30 }), 30000),   // 30s
      setTimeout(() => trackEvent('time_on_page', { timeOnPage: 60 }), 60000),   // 1m
      setTimeout(() => trackEvent('time_on_page', { timeOnPage: 120 }), 120000), // 2m
      setTimeout(() => trackEvent('time_on_page', { timeOnPage: 300 }), 300000), // 5m
    ];

    // Exit intent tracking (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTracked.current && window.innerWidth > 768) {
        exitIntentTracked.current = true;
        trackEvent('exit_intent');
      }
    };

    // Visibility change tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
        trackEvent('page_exit', { timeOnPage });
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);  
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      timeTrackers.forEach(timer => clearTimeout(timer));
    };
  }, [trackEvent]);

  const trackPageView = async (page?: string): Promise<void> => {
    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '/');
    pageStartTime.current = Date.now();
    interactionCount.current = 0;
    maxScrollDepth.current = 0;
    await trackEvent('page_view', { page: currentPage });
    trackGA4PageView(currentPage);
  };

  const trackFormView = async (): Promise<void> => {
    await trackEvent('lead_form_view');
  };

  const trackFormSubmit = async (data?: TrackEventData): Promise<void> => {
    await trackEvent('lead_form_submit', data);
  };

  const trackSectionView = async (section: string): Promise<void> => {
    await trackEvent('section_view', { section });
  };

  const trackButtonClick = async (buttonText: string): Promise<void> => {
    await trackEvent('button_click', { buttonText });
  };

  const trackScrollDepth = async (depth: number): Promise<void> => {
    await trackEvent('scroll_depth', { scrollDepth: depth });
  };

  const trackTimeOnPage = async (seconds: number): Promise<void> => {
    await trackEvent('time_on_page', { timeOnPage: seconds });
  };

  const trackContactIntent = async (method: string, intent: 'high' | 'medium' | 'low'): Promise<void> => {
    await trackEvent('contact_intent', { buttonText: method, contactIntent: intent });
  };

  const trackDeviceInteraction = async (interaction: string): Promise<void> => {
    await trackEvent('device_interaction', { buttonText: interaction });
  };

  const trackFormInteraction = async (field: string, action: 'focus' | 'blur' | 'complete' | 'abandon'): Promise<void> => {
    await trackEvent('form_interaction', { section: field, buttonText: action });
  };

  const trackExitIntent = async (): Promise<void> => {
    await trackEvent('exit_intent');
  };

  return {
    trackEvent,
    trackPageView,
    trackFormView,
    trackFormSubmit,
    trackSectionView,
    trackButtonClick,
    trackScrollDepth,
    trackTimeOnPage,
    trackContactIntent,
    trackDeviceInteraction,
    trackFormInteraction,
    trackExitIntent,
    sessionId: sessionIdRef.current
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
} 