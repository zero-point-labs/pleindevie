'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

interface UseInViewOptions {
  threshold?: number;
  trackSection?: string; // New option to track section views
}

export function useInView(options: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const { trackSectionView } = useAnalytics();
  const hasTracked = useRef(false);
  const trackingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        // Track section view if specified and not already tracked (with debouncing)
        if (inView && options.trackSection && !hasTracked.current) {
          // Clear any pending tracking
          if (trackingTimeout.current) {
            clearTimeout(trackingTimeout.current);
          }
          
          // Debounce the tracking to prevent rapid fire
          trackingTimeout.current = setTimeout(() => {
            trackSectionView(options.trackSection!);
            hasTracked.current = true;
          }, 500); // Wait 500ms before tracking
        }
      },
      {
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      // Clean up timeout on unmount
      if (trackingTimeout.current) {
        clearTimeout(trackingTimeout.current);
      }
    };
  }, [options.threshold, options.trackSection, trackSectionView]);

  return { ref, isInView };
}
