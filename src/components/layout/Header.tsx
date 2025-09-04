'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Scissors, Phone } from 'lucide-react';
import { ANIMATION_DURATION, ANIMATION_EASE } from '@/constants';
import Image from 'next/image';

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

  // Navigation items for barbershop
  const navItems = [
    { name: 'Αρχική', href: '#hero', id: 'hero' },
    { name: 'Σχετικά', href: '#about', id: 'about' },
    { name: 'Υπηρεσίες', href: '#services', id: 'services' },
    { name: 'Επικοινωνία', href: '#contact', id: 'contact' },
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

  // Handle book appointment button click
  const handleBookAppointment = () => {
    window.open('https://pleindevie.setmore.com/?fbclid=PAZXh0bgNhZW0CMTEAAadRNjEz4yqLV0E29vgg08nRtjNk9S4igPVKoQKzeztGj2I27sWxFnes7fKsPw_aem_xBfghmvbmbu272QiHfbQaA', '_blank');
  };

  // Handle call button click
  const handleCallNow = () => {
    window.location.href = 'tel:+35797825899';
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-lg shadow-lg border-b border-blue-500/20'
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
            {/* Logo Image */}
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full shadow-lg overflow-hidden">
                <Image
                  src="/barber-context/logo.jpg"
                  alt="Plein De Vie Logo"
                  width={48}
                  height={48}
                  className="object-cover rounded-full"
                />
              </div>
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg -z-10" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-white leading-tight">
                Plein De Vie
              </span>
              <span className="text-xs text-blue-400 font-medium leading-tight">
                Premium Κουρείο
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <motion.div
            className="hidden lg:flex items-center space-x-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: ANIMATION_DURATION.normal,
              delay: 0.5,
              ease: ANIMATION_EASE.bounce,
            }}
          >
            {/* Call Button */}
            <Button
              onClick={handleCallNow}
              variant="outline"
              className="group border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 font-medium px-4 py-2"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="relative z-10">Κλήση</span>
            </Button>
            
            {/* Book Appointment Button */}
            <Button
              onClick={handleBookAppointment}
              className="group relative overflow-hidden bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl"
            >
              <Scissors className="w-4 h-4 mr-2" />
              <span className="relative z-10">Κλείστε Τώρα</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-b border-blue-500/20 shadow-xl"
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
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-200 font-medium"
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
              
              {/* Mobile CTA Buttons */}
              <motion.div
                className="pt-4 border-t border-blue-500/20 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION.fast,
                  delay: navItems.length * 0.1,
                }}
              >
                <Button
                  onClick={handleBookAppointment}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold py-3 shadow-lg"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Κλείστε Ραντεβού
                </Button>
                
                <Button
                  onClick={handleCallNow}
                  variant="outline"
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 font-medium py-3"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Καλέστε Τώρα
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
