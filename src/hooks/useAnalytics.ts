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

const trackGA4Event = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
};

const trackGA4PageView = (page: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', 'page_view', {
      page_path: page,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
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
    (window as Window & typeof globalThis & { doNotTrack?: string }).doNotTrack === '1' ||
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack === '1'
  );
};

// Update consent state
const updateConsent = (granted: boolean) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const consentState = {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  };

  window.gtag('consent', 'update', consentState);
  console.log(`Analytics consent updated to: ${granted ? 'granted' : 'denied'}`);
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

  // Initialize session ID and set up consent listener
  useEffect(() => {
    console.log('[Analytics] Hook initializing...');
    if (sessionIdRef.current) {
      console.log('[Analytics] Hook already initialized.');
      return;
    }

    console.log(`[Analytics] GA_ID from env: ${process.env.NEXT_PUBLIC_GA_ID || 'NOT FOUND'}`);

    // Generate or retrieve session ID
    let sid = sessionStorage.getItem('analytics_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sid);
      console.log(`[Analytics] New session ID generated: ${sid}`);
    } else {
      console.log(`[Analytics] Existing session ID found: ${sid}`);
    }
    sessionIdRef.current = sid;

    // Initial page view
    console.log(`[Analytics] Tracking initial page view for: ${window.location.pathname}`);
    trackGA4PageView(window.location.pathname);

    // Handle initial consent state
    const initialConsent = hasGrantedConsent();
    console.log(`[Analytics] Initial consent check: ${initialConsent}`);
    updateConsent(initialConsent);

    // Listen for consent changes
    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      console.log(`[Analytics] 'analytics-consent' event received with detail: ${detail}`);
      const isGranted = detail === 'granted';
      updateConsent(isGranted);

      // If consent has just been granted, track the current page view immediately
      if (isGranted) {
        console.log('[Analytics] Consent granted, firing page_view event now.');
        trackGA4PageView(window.location.pathname);
      }
    };

    console.log('[Analytics] Adding consent change listener.');
    window.addEventListener('analytics-consent', handleConsentChange);
    return () => {
      console.log('[Analytics] Removing consent change listener.');
      window.removeEventListener('analytics-consent', handleConsentChange);
    };
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
