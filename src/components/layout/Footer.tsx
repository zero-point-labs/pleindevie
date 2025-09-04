'use client';


import Image from 'next/image';
import { Phone, MapPin, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Αρχική', href: '#hero' },
    { name: 'Σχετικά', href: '#about' },
    { name: 'Υπηρεσίες', href: '#services' },
    { name: 'Επικοινωνία', href: '#contact' },
  ];

  const serviceFeatures = [
    'Κοπή Μαλλιών με Ακρίβεια',
    'Κούρεμα & Σχηματισμός Γενιού',
    'Σαμπουάν & Μαλακτικό',
    'Styling με Premium Προϊόντα',
    'Μάσκα Προσώπου (επιλογή)',
    'Κερί Styling (επιλογή)',
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: 'Τηλέφωνο',
      value: '+357 97 825899',
      href: 'tel:+35797825899',
    },
    {
      icon: MapPin,
      label: 'Διεύθυνση',
      value: 'Eleftherias 21, Lakatamia 2304, Nicosia, Cyprus',
      href: 'https://maps.google.com/?q=Eleftherias+21+Lakatamia+2304+Nicosia+Cyprus',
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: 'pleindeviepleindevie@gmail.com',
      href: 'mailto:pleindeviepleindevie@gmail.com',
    },
  ];

  const workingHours = [
    { day: 'Τρί - Παρ', time: '09:00 - 19:00' },
    { day: 'Σάββατο', time: '09:00 - 16:00' },
    { day: 'Δευ - Κυρ', time: 'Κλειστό' },
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black" />
        
        {/* Subtle blue accents */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <BlurFade delay={0.1} inView>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20">
                    <Image
                      src="/barber-context/logo.jpg"
                      alt="Plein De Vie Logo"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Plein De Vie</h3>
                    <p className="text-sm text-blue-400">Premium Κουρείο</p>
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed">
                  Όπου το στυλ συναντά την τελειότητα. Ζήστε την τέχνη της περιποίησης με τους μάστορες 
                  κουρείς μας στην καρδιά της Λευκωσίας.
                </p>
                
                {/* Social Links */}
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </BlurFade>

            {/* Quick Links */}
            <BlurFade delay={0.2} inView>
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Γρήγορες Συνδέσεις</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>

            {/* Services */}
            <BlurFade delay={0.3} inView>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Πλήρες Πακέτο €13</h4>
                <p className="text-blue-400 text-sm mb-4 font-medium">Περιλαμβάνει:</p>
                <ul className="space-y-3">
                  {serviceFeatures.map((feature) => (
                    <li key={feature} className="text-gray-400 text-sm">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>

            {/* Contact & Hours */}
            <BlurFade delay={0.4} inView>
              <div className="space-y-8">
                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6">Στοιχεία Επικοινωνίας</h4>
                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <a
                        key={info.label}
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                      >
                        <info.icon className="w-5 h-5 mt-0.5 text-blue-500 group-hover:text-blue-400" />
                        <span className="text-sm leading-relaxed">{info.value}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Ώρες Λειτουργίας
                  </h4>
                  <div className="space-y-2">
                    {workingHours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between text-sm">
                        <span className="text-gray-400">{schedule.day}</span>
                        <span className={schedule.time === 'Κλειστό' ? 'text-red-400' : 'text-gray-300'}>
                          {schedule.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Bottom Bar */}
        <BlurFade delay={0.5} inView>
          <div className="border-t border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Plein De Vie. All rights reserved.
                </p>
                
                <div className="flex gap-6 text-sm">
                  <a href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Πολιτική Απορρήτου
                  </a>
                  <a href="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Όροι Υπηρεσίας
                  </a>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </footer>
  );
};

export default Footer;