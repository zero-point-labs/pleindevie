'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Terms of Service</h1>

      <section className="text-lg text-gray-700 leading-relaxed space-y-6">
        <p>
          Welcome to our website. By accessing or using this site you agree to be bound by these Terms
          of Service (&quot;Terms&quot;). If you do not agree with any part of the Terms, you may not use the
          site.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">1. Services Provided</h2>
        <p>
          We provide informational content and a lead-capture form for home-renovation services. No
          purchase is made on this site.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">2. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate information when submitting a lead.</li>
          <li>Do not use the site for unlawful, harmful, or abusive purposes.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">3. Intellectual Property</h2>
        <p>
          All content on this site is owned by us or our licensors and is protected by copyright and
          other laws. You may not reproduce or redistribute content without permission.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any indirect or consequential
          damages arising from your use of the site.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">5. Governing Law</h2>
        <p>These Terms are governed by the laws of the jurisdiction where our company is registered.</p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">6. Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the site after changes
          indicates acceptance of the revised Terms.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">7. Contact</h2>
        <p>
          Questions? Email&nbsp;
          <a
            href="mailto:legal@yourbusiness.com"
            className="text-yellow-600 underline hover:text-yellow-700"
          >
            legal@yourbusiness.com
          </a>
          .
        </p>
      </section>
    </main>
  );
} 