'use client';

export function Footer() {
  const openConsentManager = () => {
    window.dispatchEvent(new Event('open-consent-manager'));
  };

  return (
    <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-600">
      <div className="space-x-4">
        <button
          onClick={openConsentManager}
          className="underline hover:text-yellow-600 transition-colors"
        >
          Cookie settings
        </button>
        <a
          href="/privacy-policy"
          className="underline hover:text-yellow-600 transition-colors"
        >
          Privacy Policy
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} RenovatePro. All rights reserved.</p>
    </footer>
  );
} 