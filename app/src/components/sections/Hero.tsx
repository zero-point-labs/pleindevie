'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CompareSlider } from '@/components/ui/compare-slider';
import { BorderBeam } from '@/components/ui/border-beam';
import { FloatingIcons } from '@/components/ui/floating-icons';
import { ANIMATION_DURATION, ANIMATION_EASE } from '@/constants';
import { useInView } from '@/hooks/useInView';
import { useAnalytics } from '@/hooks/useAnalytics';

const Hero = () => {
  const { trackButtonClick } = useAnalytics();
  const { ref: heroRef } = useInView({ trackSection: 'hero' });

  // Animation variants for staggered text animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATION.slow,
        ease: ANIMATION_EASE.easeOut,
      },
    },
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.bounce,
        delay: 0.8,
      },
    },
  };

  return (
    <section 
      ref={heroRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black"
      aria-label="Hero section with company introduction and before/after renovation showcase"
    >
      {/* Dark textured background */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" 
        aria-hidden="true"
      />
      
      {/* Animated yellow accent gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-500/5 animate-pulse" 
        aria-hidden="true"
      />
      
      {/* Subtle grid texture */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" 
        aria-hidden="true"
      />
      
      {/* Floating Icons */}
      <FloatingIcons />
      
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col items-center justify-center gap-12 py-20 md:grid md:grid-cols-2 md:gap-16">
          
          {/* Left Column - Text Content */}
          <motion.div
            className="flex flex-col justify-center space-y-8 text-center md:text-left order-1 md:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Headline */}
            <motion.h1
              className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
              variants={itemVariants}
              role="banner"
            >
              Transform Your{' '}
              <span className="bg-gradient-to-r from-[#fbbf24] to-[#fcd34d] bg-clip-text text-transparent">
                Space,
              </span>
              {' '}Elevate Your Life
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg text-gray-300 sm:text-xl lg:text-2xl"
              variants={itemVariants}
            >
              Professional home renovations that transform your space in{' '}
              <span className="font-semibold text-[#fbbf24]">30 days or less</span>.
              From outdated to outstanding, we bring your vision to life.
            </motion.p>

            {/* Key Benefits */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:justify-start"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                <span className="text-sm font-medium text-white">5-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                <span className="text-sm font-medium text-white">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                <span className="text-sm font-medium text-white">Free Consultation</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              variants={buttonVariants}
              role="group"
              aria-label="Call to action buttons"
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-[#fbbf24] text-[#2C3E50] hover:bg-[#fcd34d] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#2C3E50]"
                onClick={() => {
                  trackButtonClick('Get Free Quote');
                  // Scroll to contact form or open modal
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Get a free renovation quote"
              >
                <span className="relative z-10 font-semibold">Get Free Quote</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#fcd34d] to-[#fbbf24] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-[#2C3E50] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#2C3E50]"
                onClick={() => {
                  trackButtonClick('View Our Work');
                  // Scroll to portfolio section
                  document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="View our renovation portfolio"
              >
                View Our Work
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-col items-center space-y-2 md:items-start"
              variants={itemVariants}
              role="region"
              aria-label="Customer reviews and ratings"
            >
              <div className="flex items-center space-x-1" role="img" aria-label="5 out of 5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-[#fbbf24]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Trusted by 500+ homeowners • 4.9/5 rating
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Before/After Slider */}
          <motion.div
            className="flex items-center justify-center order-2 md:order-2 w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: ANIMATION_DURATION.slower,
              delay: 0.4,
              ease: ANIMATION_EASE.easeOut,
            }}
          >
            <div className="relative w-full">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-[#fbbf24]/20 blur-xl" aria-hidden="true" />
              <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-[#fbbf24]/10 blur-2xl" aria-hidden="true" />
              
              {/* Compare Slider Component with Border Beam */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl w-full h-[350px] md:h-[450px] lg:h-[500px] min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
                <CompareSlider
                  beforeImage="/after.jpg"
                  afterImage="/before.jpg"
                  beforeLabel="Before"
                  afterLabel="After"
                  className="w-full h-full rounded-2xl"
                />
                {/* Animated Border Beam */}
                <BorderBeam
                  size={200}
                  duration={6}
                  delay={0}
                  colorFrom="#fbbf24"
                  colorTo="#fcd34d"
                  borderWidth={3}
                  className="opacity-90"
                />
                {/* Additional shiny effect - second beam */}
                <BorderBeam
                  size={150}
                  duration={4}
                  delay={1}
                  colorFrom="#FFFFFF"
                  colorTo="#fbbf24"
                  borderWidth={1}
                  className="opacity-60"
                  reverse={true}
                />
              </div>
              
              {/* Floating badge */}
              <div 
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#fbbf24] text-[#2C3E50] px-6 py-3 rounded-full font-bold text-sm shadow-lg z-20"
                role="note"
                aria-label="Renovation completion time"
              >
                30-Day Transformation
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to explore more content"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
          }
        }}
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
        <div className="flex flex-col items-center space-y-2 cursor-pointer">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            className="h-6 w-4 border-2 border-gray-400 rounded-full flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-1" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
