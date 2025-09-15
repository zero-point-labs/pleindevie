'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SparklesText } from '@/components/ui/sparkles-text';
import { ANIMATION_DURATION, ANIMATION_EASE } from '@/constants';
import { useInView } from '@/hooks/useInView';

import { Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getCurrentBusinessStatus } from '@/utils/businessHours';

const Hero = () => {
  const { ref: heroRef } = useInView();
  
  // Rotating text for subtitle
  const [textIndex, setTextIndex] = useState(0);
  const subtitleVariants = [
    'Where Style Meets Perfection',
    'Premium Grooming Experience',
    'Your Signature Look Awaits',
    'Crafted with Precision'
  ];
  
  // Business status state
  const [businessStatus, setBusinessStatus] = useState(getCurrentBusinessStatus());
  
  // Video playback state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % subtitleVariants.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [subtitleVariants.length]);

  // Update business status every minute
  useEffect(() => {
    const updateBusinessStatus = () => {
      setBusinessStatus(getCurrentBusinessStatus());
    };
    
    // Update immediately
    updateBusinessStatus();
    
    // Update every minute
    const interval = setInterval(updateBusinessStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Video handling for mobile and desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video to always be visible (even if not playing)
    setIsVideoPlaying(true);

    // Simple autoplay attempt
    const attemptAutoplay = async () => {
      try {
        // Ensure video is muted (required for autoplay)
        video.muted = true;
        video.defaultMuted = true;
        
        // Try to play
        await video.play();
        console.log('Video autoplay successful');
      } catch (error) {
        console.log('Video autoplay failed, will play on user interaction:', error);
        
        // Fallback: Play on first user interaction
        const playOnUserInteraction = async () => {
          try {
            await video.play();
            console.log('Video started on user interaction');
          } catch (e) {
            console.log('Video play failed:', e);
          }
        };
        
        // Add listeners for user interaction
        document.addEventListener('click', playOnUserInteraction, { once: true });
        document.addEventListener('touchstart', playOnUserInteraction, { once: true });
        document.addEventListener('scroll', playOnUserInteraction, { once: true });
      }
    };

    // Wait for video to be ready then attempt play
    if (video.readyState >= 3) {
      attemptAutoplay();
    } else {
      video.addEventListener('canplaythrough', attemptAutoplay, { once: true });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

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
      className="relative min-h-screen overflow-hidden bg-black"
      aria-label="Plein De Vie Barbershop Hero Section"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Fallback gradient background for when video doesn't play */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoPlaying ? 'opacity-100' : 'opacity-70'
          }`}
          style={{
            filter: 'contrast(1.1) saturate(1.1) brightness(0.9)',
          }}
        >
          <source src="/video-background-compressed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Corner vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/40 via-transparent to-black/40" />
        
        {/* Blue accent lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
      </div>
      
      {/* Animated blue light beams */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col items-center justify-center py-20">
          
          {/* Main Content Container - Better spaced from top */}
          <motion.div
            className="flex flex-col items-center text-center max-w-4xl mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo/Brand Name with Sparkle Effect */}
            <motion.div
              variants={itemVariants}
              className="relative mb-6"
            >
              <SparklesText
                className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white uppercase tracking-wider"
                colors={{ first: "#3b82f6", second: "#60a5fa" }}
                sparklesCount={6}
              >
                Plein De Vie
              </SparklesText>
              {/* Animated underline */}
              <motion.div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '10rem' }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </motion.div>

            {/* Rotating Tagline with Fade Effect */}
            <motion.div
              variants={itemVariants}
              className="relative mb-10 h-10"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide leading-relaxed whitespace-nowrap absolute inset-0 flex items-center justify-center"
                >
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                    {subtitleVariants[textIndex]}
                  </span>
                </motion.p>
              </AnimatePresence>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-xl" />
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
              variants={buttonVariants}
            >
              {/* Primary Book Appointment Button */}
              <Button
                size="lg"
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white border-0 px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-lg shadow-xl"
                onClick={() => {
                  window.open('https://pleindevie.setmore.com/?fbclid=PAZXh0bgNhZW0CMTEAAadRNjEz4yqLV0E29vgg08nRtjNk9S4igPVKoQKzeztGj2I27sWxFnes7fKsPw_aem_xBfghmvbmbu272QiHfbQaA', '_blank');
                }}
              >
                <Calendar className="mr-2 h-5 w-5" />
                <span className="relative z-10">Κλείστε Ραντεβού</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              {/* Secondary Call Button */}
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 text-white hover:bg-white/5 hover:border-white/60 bg-transparent backdrop-blur-sm px-10 py-4 text-lg font-medium transition-all duration-300 rounded-lg"
                onClick={() => {
                  window.location.href = 'tel:+35797825899';
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Καλέστε Τώρα
              </Button>
            </motion.div>

            {/* Contact Info Bar - Simple and Clean */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-gray-400"
              variants={itemVariants}
            >
              <a 
                href="tel:+35797825899"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>97 825899</span>
              </a>
              <a 
                href="https://maps.google.com/?q=Eleftherias+21+Lakatamia+2304+Nicosia+Cyprus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>Eleftherias 21, Lakatamia</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${businessStatus.isOpen ? 'text-green-400' : 'text-red-400'}`} />
                <span className={businessStatus.displayColor}>{businessStatus.displayText}</span>
              </div>
            </motion.div>

            {/* Premium Badge - Better spaced */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full px-6 py-3">
                <span className="text-xs uppercase tracking-wider text-blue-300">Premium Κουρείο</span>
                <span className="text-white">•</span>
                <span className="text-xs text-gray-300">Λακατάμια, Λευκωσία</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
        <div className="flex flex-col items-center space-y-2 cursor-pointer">
          <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider text-center whitespace-nowrap">
            Ανακαλύψτε Περισσότερα
          </span>
          <motion.div
            className="h-6 w-4 border-2 border-gray-600 rounded-full flex justify-center items-start"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-1" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
