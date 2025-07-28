'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';

export function ConsentManager() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<'accepted' | 'declined' | undefined>();

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
      setConsent(stored === 'accepted' ? 'accepted' : 'declined');
    }
  }, [open]);

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'granted' }));
    setConsent('accepted');
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined');
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: 'denied' }));
    setConsent('declined');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg min-w-[400px] rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Cookie settings</h2>
        <p className="mb-6 text-sm text-gray-700 leading-relaxed whitespace-normal">
          You can change your analytics cookie preferences below. Your choice will apply immediately.
        </p>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={consent === 'declined' ? undefined : 'outline'}
            onClick={handleDecline}
            className="flex-1 px-6 py-3 whitespace-nowrap"
          >
            Decline
          </Button>
          <Button
            variant={consent === 'accepted' ? undefined : 'outline'}
            onClick={handleAccept}
            className="flex-1 px-6 py-3 whitespace-nowrap"
          >
            Accept all
          </Button>
        </div>
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