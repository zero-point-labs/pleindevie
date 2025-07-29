'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';

export function ConsentManager() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<'accepted' | 'declined' | undefined>();
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);

  // Listen for external event to open the manager
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-consent-manager', handler);
    return () => window.removeEventListener('open-consent-manager', handler);
  }, []);

  // Sync consent status from localStorage when opening
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('analytics_consent') as 'accepted' | 'declined' | null;
      const timestamp = localStorage.getItem('analytics_consent_timestamp');
      setConsent(stored === 'accepted' ? 'accepted' : 'declined');
      setConsentTimestamp(timestamp);
    }
  }, [open]);

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

    console.log('🍪 All analytics cookies cleared via consent manager');
  };

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    localStorage.setItem('analytics_consent_timestamp', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'granted' }));
    setConsent('accepted');
    setConsentTimestamp(new Date().toISOString());
    setOpen(false);
    console.log('✅ Analytics consent granted via consent manager');
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined');
    localStorage.setItem('analytics_consent_timestamp', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'denied' }));
    
    // Clear all analytics data
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

    setConsent('declined');
    setConsentTimestamp(new Date().toISOString());
    setOpen(false);
    console.log('🚫 Analytics consent declined via consent manager and all data cleared');
  };

  const handleClearAllData = () => {
    // Clear all analytics data regardless of consent status
    clearAllAnalyticsCookies();
    
    // Clear all analytics related localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('analytics_')) {
        localStorage.removeItem(key);
      }
    });

    // Clear all analytics related sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('analytics_')) {
        sessionStorage.removeItem(key);
      }
    });

    // Reset consent
    setConsent(undefined);
    setConsentTimestamp(null);
    
    // Notify application
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'denied' }));
    
    alert('✅ All analytics data and cookies have been cleared. You will see the consent banner again on your next page visit.');
    setOpen(false);
    console.log('🧹 All analytics data cleared via consent manager');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg min-w-[400px] rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Cookie & Privacy Settings</h2>
        
        {/* Current Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Current Settings</h3>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center mb-1">
              <span>Analytics Cookies:</span>
              <span className={`font-medium ${consent === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                {consent === 'accepted' ? '✅ Enabled' : '🚫 Disabled'}
              </span>
            </div>
            {consentTimestamp && (
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(consentTimestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-700 leading-relaxed whitespace-normal">
          You can change your analytics cookie preferences below. Your choice will apply immediately and be remembered for future visits.
        </p>

        {/* Cookie Description */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What are Analytics Cookies?</h4>
          <p className="text-sm text-blue-800">
            We use Google Analytics 4 to track website usage statistics like page views, visitor counts, and lead submissions. This helps us improve your experience but is not essential for the website to function.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={consent === 'declined' ? undefined : 'outline'}
            onClick={handleDecline}
            className="flex-1 px-6 py-3 whitespace-nowrap"
          >
            Decline Analytics
          </Button>
          <Button
            variant={consent === 'accepted' ? undefined : 'outline'}
            onClick={handleAccept}
            className="flex-1 px-6 py-3 whitespace-nowrap"
          >
            Accept Analytics
          </Button>
        </div>

        {/* Advanced Options */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Options</h4>
          <Button
            variant="outline"
            onClick={handleClearAllData}
            className="w-full mb-3 text-red-600 border-red-200 hover:bg-red-50"
          >
            🧹 Clear All Data & Reset
          </Button>
          <p className="text-xs text-gray-500 mb-3">
            This will remove all analytics cookies and stored data, and reset your consent preferences.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
} 