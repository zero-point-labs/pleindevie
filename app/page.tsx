'use client';

import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import LeadCaptureForm from '@/components/sections/LeadCaptureForm';
import { PrivacyNotice } from '@/components/ui/privacy-notice';
export default function Home() {

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#2C3E50]">
        <Hero />
        
        {/* Lead Capture Form Section - Now full screen with its own background */}
        <LeadCaptureForm />
        
        {/* Additional sections will be added here as we progress through the tasks */}
      </main>
      
      {/* Privacy Notice is now handled globally in RootLayout */}
    </>
  );
}
