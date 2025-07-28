'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-6">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">1. Information we collect</h2>
            <p>
              We only collect anonymous usage statistics through Google Analytics 4 when you have given us explicit consent. No personally identifiable information is collected unless you voluntarily provide it via contact forms.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">2. How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To analyse website traffic and improve our services</li>
              <li>To respond to enquiries you submit via forms</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">3. Cookies</h2>
            <p>
              Cookies are small data files stored on your device. We use analytics cookies <strong>only</strong> after you accept them. You can withdraw consent at any time via "Cookie settings" in the footer.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">4. Third-party services</h2>
            <p>
              We use Google Analytics 4 with Google Consent Mode v2. Analytics cookies are set to <em>denied</em> by default and switch to <em>granted</em> only after your consent.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">5. Your rights</h2>
            <p>
              Under applicable data-protection law you have rights to access, rectify, erase, restrict, or object to the processing of your personal data. To exercise these rights please contact us.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">6. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please email <a href="mailto:privacy@example.com" className="text-yellow-600 underline hover:text-yellow-700">privacy@example.com</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 