'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';

export function PrivacyNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Respect Do Not Track header – treat as declined
    const dnt = typeof navigator !== 'undefined' && (
      navigator.doNotTrack === '1' || 
      (window as Window & typeof globalThis & { doNotTrack?: string }).doNotTrack === '1' || 
      (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack === '1'
    );

    if (dnt) {
      localStorage.setItem('analytics_consent', 'declined');
      console.log('🚫 Do Not Track detected - Analytics consent automatically declined');
      return;
    }

    const existingConsent = localStorage.getItem('analytics_consent');

    if (!existingConsent) {
      // Show notice after a configurable delay to avoid layout shift
      const delay = parseInt(process.env.NEXT_PUBLIC_CONSENT_BANNER_DELAY || '2000');
      const timer = setTimeout(() => setShowNotice(true), delay);
      return () => clearTimeout(timer);
    }
  }, []);

  const clearAllAnalyticsCookies = () => {
    // Clear Google Analytics cookies comprehensively
    const cookieNames = ['_ga', '_gid', '_gac_', '_gtag_', '_gcl_au', '_gcl_aw', '_gac_GB_'];
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    
    cookieNames.forEach(cookieName => {
      domains.forEach(domain => {
        // Clear for current path and root path
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}; SameSite=Lax`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      });
    });

    // Clear any cookies that start with GA patterns
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const trimmed = cookie.trim();
      if (trimmed.startsWith('_ga') || trimmed.startsWith('_gid') || trimmed.startsWith('_gac') || trimmed.startsWith('_gtag')) {
        const eqPos = trimmed.indexOf('=');
        const name = eqPos > -1 ? trimmed.substr(0, eqPos) : trimmed;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}; SameSite=Lax`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
      }
    });

    console.log('🍪 All analytics cookies cleared');
  };

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    localStorage.setItem('analytics_consent_timestamp', new Date().toISOString());
    
    // Notify application
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'granted' }));
    setShowNotice(false);
    
    console.log('✅ Analytics consent granted');
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined');
    localStorage.setItem('analytics_consent_timestamp', new Date().toISOString());
    
    // Notify application first
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'denied' }));

    // Clear all analytics cookies
    clearAllAnalyticsCookies();

    // Clear localStorage analytics data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('analytics_') && key !== 'analytics_consent' && key !== 'analytics_consent_timestamp') {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage analytics data
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('analytics_')) {
        sessionStorage.removeItem(key);
      }
    });

    setShowNotice(false);
    console.log('🚫 Analytics consent declined and all data cleared');
  };

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-4 z-50 left-4 right-4 md:left-auto md:right-4 md:w-96">
      <div className="bg-white/95 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 text-lg">🍪</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">
              We value your privacy
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              We use Google Analytics 4 to understand how our website is used so we can improve your experience. Analytics cookies will <strong>only</strong> be set if you choose &quot;Accept all&quot;. You can withdraw your consent at any time by clicking &quot;Cookie&nbsp;settings&quot; in the footer. For full details please read our&nbsp;
              <a href="/privacy-policy" className="underline hover:text-yellow-600 transition-colors">Privacy&nbsp;Policy</a>.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDecline}
                variant="outline"
                className="border-gray-300 text-gray-600 text-xs px-3 py-1"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-xs px-3 py-1"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 