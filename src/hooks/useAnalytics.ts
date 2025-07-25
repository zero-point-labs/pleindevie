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
}

interface UseAnalyticsReturn {
  trackEvent: (type: string, data?: TrackEventData) => Promise<void>;
  trackPageView: (page?: string) => Promise<void>;
  trackFormView: () => Promise<void>;
  trackFormSubmit: (data?: TrackEventData) => Promise<void>;
  trackSectionView: (section: string) => Promise<void>;
  trackButtonClick: (buttonText: string) => Promise<void>;
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
        // Disable automatic page view tracking since we do it manually
        send_page_view: false,
      });
    }
  }
};

const trackGA4Event = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', eventName, {
      ...parameters,
      // Add custom parameters for renovation business
      timestamp: new Date().toISOString(),
    });
  }
};

const trackGA4PageView = (page: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: page,
    });
  }
};

export function useAnalytics(): UseAnalyticsReturn {
  const sessionIdRef = useRef<string>('');
  const lastTrackTime = useRef<{ [key: string]: number }>({});

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

    // Prevent duplicate tracking within 5 seconds for the same event type
    const eventKey = `${type}_${data.section || data.page || ''}`;
    const now = Date.now();
    if (lastTrackTime.current[eventKey] && now - lastTrackTime.current[eventKey] < 5000) {
      return;
    }
    lastTrackTime.current[eventKey] = now;

    try {
      const eventData = {
        ...data,
        referrer: getReferrer(),
        viewport: getViewportSize()
      };

      // Prioritize Google Analytics 4 tracking
      trackGA4Event(type, {
        event_category: getEventCategory(type),
        event_label: data.section || data.buttonText || '',
        custom_parameter_project_type: data.projectType,
        custom_parameter_budget: data.budget,
        custom_parameter_timeline: data.timeline,
        session_id: sessionIdRef.current,
        page_path: data.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      });

      // OPTIMIZATION: Significantly reduced custom analytics calls
      // Only track critical events to custom analytics to minimize server load
      // GA4 now handles most tracking, custom analytics only for essential lead tracking
      const shouldTrackCustom = ['lead_form_submit'].includes(type) && 
                               (!process.env.NEXT_PUBLIC_GA_ID || process.env.NODE_ENV === 'development');
      
      if (shouldTrackCustom) {
        // Custom analytics (essential events only) - non-blocking
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
        }).catch(error => {
          // Silently handle errors to prevent disrupting user experience
          console.warn('Custom analytics tracking failed:', error);
        });
      }
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
        return 'Lead Generation';
      case 'section_view':
        return 'Engagement';
      case 'button_click':
        return 'User Interaction';
      default:
        return 'General';
    }
  };

  // Initialize GA4 and generate session ID
  useEffect(() => {
    // Prevent multiple initializations
    if (sessionIdRef.current) return;
    
    // Initialize GA4
    initGA4();

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;

    // Track initial page view only once
    const trackInitialPageView = async () => {
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';
      
      // Always track to GA4 first (primary analytics)
      trackGA4PageView(currentPage);
      
      // OPTIMIZATION: Skip custom analytics page view tracking to reduce API calls
      // GA4 handles page views more efficiently, custom analytics only for leads
      console.log('📊 Page view tracked to GA4:', currentPage);
    };
    
    trackInitialPageView();
  }, []); // Removed trackEvent dependency to prevent circular re-initialization

  const trackPageView = async (page?: string): Promise<void> => {
    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '/');
    
    // Track to GA4 (primary analytics system)
    trackGA4PageView(currentPage);
    
    // OPTIMIZATION: Custom analytics only used for development or when GA4 unavailable
    if (!process.env.NEXT_PUBLIC_GA_ID || process.env.NODE_ENV === 'development') {
      await trackEvent('page_view', { page: currentPage });
    }
  };

  const trackFormView = async (): Promise<void> => {
    await trackEvent('lead_form_view');
  };

  const trackFormSubmit = async (data?: TrackEventData): Promise<void> => {
    // Form submissions are critical - always track to both systems
    await trackEvent('lead_form_submit', data);
  };

  const trackSectionView = async (section: string): Promise<void> => {
    await trackEvent('section_view', { section });
  };

  const trackButtonClick = async (buttonText: string): Promise<void> => {
    await trackEvent('button_click', { buttonText });
  };

  return {
    trackEvent,
    trackPageView,
    trackFormView,
    trackFormSubmit,
    trackSectionView,
    trackButtonClick,
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