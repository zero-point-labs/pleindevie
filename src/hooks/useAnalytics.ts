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

// Helper: inject GA script dynamically
const loadGaScript = (gaId: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();

    // If script already loaded resolve immediately
    if (document.getElementById('ga-consent-script')) {
      return resolve();
    }

    // Create global dataLayer and gtag function if not present
    window.dataLayer = window.dataLayer || [];
    function gtag(){
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    // Consent mode default – denied until user grants
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });

    const script = document.createElement('script');
    script.id = 'ga-consent-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.onload = () => {
      resolve();
    };
    document.head.appendChild(script);
  });
};

// Helper: check if user has granted consent
const hasGrantedConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('analytics_consent') === 'accepted';
};

// Helper: Respect Do Not Track header
const isDNT = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return (
    navigator.doNotTrack === '1' ||
    (window as any).doNotTrack === '1' ||
    (navigator as any).msDoNotTrack === '1'
  );
};

// Enable analytics after consent
const enableAnalytics = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  await loadGaScript(process.env.NEXT_PUBLIC_GA_ID);
  initGA4();
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  const currentPage = window.location.pathname;
  trackGA4PageView(currentPage);
};

// Disable analytics and clear cookies
const disableAnalytics = (): void => {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  // Clear cookies
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const trimmed = cookie.trim();
    if (trimmed.startsWith('_ga') || trimmed.startsWith('_gid') || trimmed.startsWith('_gac')) {
      const eqPos = trimmed.indexOf('=');
      const name = eqPos > -1 ? trimmed.substr(0, eqPos) : trimmed;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
    }
  });
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
    if (consent !== 'accepted') return;

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
    if (sessionIdRef.current) return;

    // Generate or retrieve session ID (independent of analytics consent)
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;

    // Handle initial consent state respecting DNT
    if (isDNT() || localStorage.getItem('analytics_consent') === 'declined') {
      disableAnalytics();
    } else if (hasGrantedConsent()) {
      enableAnalytics();
    }

    // Listen for consent change events to enable/disable analytics on the fly
    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail === 'granted') {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
    };
    window.addEventListener('analytics-consent', handleConsentChange);
    return () => window.removeEventListener('analytics-consent', handleConsentChange);
  }, []);

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