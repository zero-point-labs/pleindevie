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

    // Prevent duplicate tracking within 2 seconds for the same event type
    const eventKey = `${type}_${data.section || data.page || ''}`;
    const now = Date.now();
    if (lastTrackTime.current[eventKey] && now - lastTrackTime.current[eventKey] < 2000) {
      return;
    }
    lastTrackTime.current[eventKey] = now;

    try {
      const eventData = {
        ...data,
        referrer: getReferrer(),
        viewport: getViewportSize()
      };

      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          sessionId: sessionIdRef.current,
          data: eventData
        })
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, []);

  // Generate or retrieve session ID
  useEffect(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;

    // Track initial page view
    const trackInitialPageView = async () => {
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';
      await trackEvent('page_view', { page: currentPage });
    };
    
    trackInitialPageView();
  }, [trackEvent]);

  const trackPageView = async (page?: string): Promise<void> => {
    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '/');
    await trackEvent('page_view', { page: currentPage });
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