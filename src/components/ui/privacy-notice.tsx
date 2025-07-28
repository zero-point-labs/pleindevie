'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';

export function PrivacyNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('analytics_consent');
    if (!hasConsented) {
      // Show notice after a brief delay
      setTimeout(() => setShowNotice(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    setShowNotice(false);
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-4 z-50 left-4 right-4 md:left-auto md:right-4 md:w-80">
      <div className="bg-white/95 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 text-lg">🍪</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">
              Analytics & Cookies
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              We use basic analytics to improve your experience. We only track page visits and form interactions.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-xs px-3 py-1"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecline}
                className="border-gray-300 text-gray-600 text-xs px-3 py-1"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 