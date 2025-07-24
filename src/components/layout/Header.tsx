'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Hammer } from 'lucide-react';
import { ANIMATION_DURATION, ANIMATION_EASE } from '@/constants';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { name: 'Process', href: '#process', id: 'process' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Handle get quote button click
  const handleGetQuote = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If contact section doesn't exist yet, scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#2C3E50]/95 backdrop-blur-lg shadow-lg border-b border-[#fbbf24]/20'
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.easeOut,
        delay: 0.2,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => scrollToSection('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Logo Icon */}
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#fbbf24] to-[#fcd34d] rounded-xl shadow-lg">
                <Home className="w-5 h-5 lg:w-6 lg:h-6 text-[#2C3E50]" />
                <Hammer className="w-3 h-3 lg:w-4 lg:h-4 text-[#2C3E50] absolute -bottom-1 -right-1" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#fbbf24]/30 rounded-xl blur-lg -z-10" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-white leading-tight">
                RenovatePro
              </span>
              <span className="text-xs text-[#fbbf24] font-medium leading-tight">
                Transform • Elevate • Inspire
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="relative text-gray-300 hover:text-white transition-colors duration-200 font-medium group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION.fast,
                  delay: 0.3 + index * 0.1,
                }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                {/* Hover underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fbbf24] to-[#fcd34d] transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: ANIMATION_DURATION.normal,
              delay: 0.5,
              ease: ANIMATION_EASE.bounce,
            }}
          >
            <Button
              onClick={handleGetQuote}
              className="group relative overflow-hidden bg-[#fbbf24] text-[#2C3E50] hover:bg-[#fcd34d] transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Get Free Quote</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcd34d] to-[#fbbf24] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: ANIMATION_DURATION.fast, delay: 0.4 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-[#2C3E50]/98 backdrop-blur-lg border-b border-[#fbbf24]/20 shadow-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-[#fbbf24]/10 rounded-lg transition-all duration-200 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: ANIMATION_DURATION.fast,
                    delay: index * 0.1,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Mobile CTA Button */}
              <motion.div
                className="pt-4 border-t border-[#fbbf24]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION.fast,
                  delay: navItems.length * 0.1,
                }}
              >
                <Button
                  onClick={handleGetQuote}
                  className="w-full bg-[#fbbf24] text-[#2C3E50] hover:bg-[#fcd34d] transition-all duration-300 font-semibold py-3 shadow-lg"
                >
                  Get Free Quote
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
