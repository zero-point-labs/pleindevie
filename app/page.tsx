'use client';

import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import WorkingHours from '@/components/sections/WorkingHours';
import ContactForm from '@/components/sections/ContactForm';

export default function Home() {

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        
        {/* About Section - Right after Hero */}
        <About />
        
        {/* Services Section */}
        <Services />
        
        {/* Working Hours Section - Continues from Services */}
        <WorkingHours />
        
        {/* Contact Form Section */}
        <ContactForm />
        
      </main>

    </>
  );
}
