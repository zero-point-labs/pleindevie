'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import { Award, Users, Calendar, Star } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, value: '18+', label: 'Χρόνια Εμπειρίας' },
    { icon: Users, value: '500+', label: 'Ικανοποιημένοι Πελάτες' },
    { icon: Star, value: '4.9', label: 'Βαθμολογία' },
    { icon: Calendar, value: '5', label: 'Μέρες την Εβδομάδα' },
  ];

  return (
    <section 
      id="about"
      className="relative min-h-screen py-20 bg-white overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full fill-gray-100 stroke-gray-200"
        )}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content First on Mobile, Right on Desktop */}
          <div className="space-y-8 lg:order-2">
            {/* Title and Description */}
            <BlurFade delay={0.3} inView>
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                  Σχετικά με εμάς
                </h2>
                <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                  Όπου το Μοντέρνο Στυλ Συναντά{' '}
                  <span className="text-blue-600">την Παραδοσιακή Τέχνη</span>
                </h3>
              </div>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <p className="text-lg text-gray-600 leading-relaxed">
                Το κουρείο μας ιδρύθηκε το 2004 από τους γονείς του Χρίστου και γρήγορα ξεχώρισε κερδίζοντας 
                την εμπιστοσύνη της τοπικής κοινότητας. Το 2022, ο Χρίστος ανακαίνισε τον χώρο και τον μετέτρεψε 
                σε ένα σύγχρονο barbershop, που σήμερα θεωρείται από τα καλύτερα στη Λευκωσία, προσφέροντας 
                στυλ, ποιότητα και μοναδική εμπειρία περιποίησης.
              </p>
            </BlurFade>

            {/* Image on Mobile only (hidden on desktop) */}
            <BlurFade delay={0.55} inView>
              <div className="relative lg:hidden">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/barber-context/aboutus.png"
                    alt="Plein De Vie Barbershop Interior"
                    width={600}
                    height={700}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <BorderBeam size={250} duration={12} delay={9} />
                </div>
                
                {/* Experience Badge */}
                <motion.div
                  className="absolute -bottom-8 -right-8 bg-blue-600 text-white rounded-2xl p-6 shadow-xl"
                  initial={{ rotate: -5, scale: 0 }}
                  animate={{ rotate: -5, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold">18+</div>
                    <div className="text-sm">Χρόνια</div>
                    <div className="text-sm">Αριστείας</div>
                  </div>
                </motion.div>
              </div>
            </BlurFade>

            {/* Stats Grid */}
            <BlurFade delay={0.6} inView>
              <div className="grid grid-cols-2 gap-6 py-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </BlurFade>

            {/* CTA Buttons */}
            <BlurFade delay={0.8} inView>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    window.open('https://pleindevie.setmore.com/?fbclid=PAZXh0bgNhZW0CMTEAAadRNjEz4yqLV0E29vgg08nRtjNk9S4igPVKoQKzeztGj2I27sWxFnes7fKsPw_aem_xBfghmvbmbu272QiHfbQaA', '_blank');
                  }}
                >
                  Κλείστε Ραντεβού
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Δείτε τις Υπηρεσίες
                </Button>
              </div>
            </BlurFade>
          </div>

          {/* Image on Desktop only (hidden on mobile) */}
          <BlurFade delay={0.2} inView>
            <div className="relative lg:order-1 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/barber-context/aboutus.png"
                  alt="Plein De Vie Barbershop Interior"
                  width={600}
                  height={700}
                  className="object-cover w-full h-full"
                  priority
                />
                <BorderBeam size={250} duration={12} delay={9} />
              </div>
              
              {/* Experience Badge */}
              <motion.div
                className="absolute -bottom-8 -right-8 bg-blue-600 text-white rounded-2xl p-6 shadow-xl"
                initial={{ rotate: -5, scale: 0 }}
                animate={{ rotate: -5, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">18+</div>
                  <div className="text-sm">Χρόνια</div>
                  <div className="text-sm">Αριστείας</div>
                </div>
              </motion.div>
            </div>
          </BlurFade>
        </div>

        {/* Bottom Quote */}
        <BlurFade delay={1} inView>
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto px-6">
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-700 italic leading-relaxed">
                &ldquo;Η αριστεία δεν είναι μια ικανότητα, είναι στάση ζωής. Στο Plein De Vie, 
                φέρνουμε αυτή τη στάση σε κάθε κούρεμα, κάθε ξύρισμα και κάθε πελάτη.&rdquo;
              </blockquote>
              <cite className="mt-6 block text-lg text-gray-500 not-italic font-medium">
                — Η Ομάδα του Plein De Vie
              </cite>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default About;
