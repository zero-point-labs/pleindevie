'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { SparklesText } from '@/components/ui/sparkles-text';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import { Scissors, Star, Award, Heart } from 'lucide-react';

const MeetBarber = () => {
  const qualities = [
    { icon: Scissors, text: 'Εξειδίκευση σε Κλασικά & Μοντέρνα Κουρέματα' },
    { icon: Star, text: 'Γνώση Σύγχρονων Τάσεων' },
    { icon: Award, text: 'Επαγγελματική Εκπαίδευση' },
    { icon: Heart, text: 'Προσοχή στη Λεπτομέρεια' },
  ];

  return (
    <section 
      id="barber"
      className="relative min-h-screen py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Background Pattern */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className={cn(
          "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full fill-blue-50 stroke-blue-100"
        )}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
              Γνωρίστε τον Κουρέα μας
            </h2>
            <SparklesText
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              colors={{ first: "#3b82f6", second: "#60a5fa" }}
              sparklesCount={4}
            >
              Αντώνης Πολυκάρπου
            </SparklesText>
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-xl text-gray-600 leading-relaxed text-center">
                Επαγγελματίας κουρέας με εξειδίκευση στα μοντέρνα κουρέματα και την περιποίηση γενιού.
              </p>
            </div>
          </motion.div>
        </BlurFade>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          <BlurFade delay={0.2} inView>
            <motion.div
              className="relative lg:order-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/andonis.png"
                  alt="Αντώνης Πολυκάρπου - Κουρέας στο Plein De Vie"
                  width={600}
                  height={700}
                  className="object-cover w-full h-full"
                  priority
                />
                <BorderBeam size={300} duration={15} delay={5} />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl p-4 shadow-xl"
                initial={{ rotate: 5, scale: 0 }}
                animate={{ rotate: 5, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <div className="text-center">
                  <Scissors className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-semibold">Εξειδικευμένος</div>
                  <div className="text-xs">Κουρέας</div>
                </div>
              </motion.div>
            </motion.div>
          </BlurFade>

          {/* Content Section */}
          <div className="space-y-8 lg:order-2">
            
            {/* Bio */}
            <BlurFade delay={0.3} inView>
              <div className="space-y-6">
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  Εμπειρία και{' '}
                  <span className="text-blue-600">Επαγγελματισμός</span>
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Ο Αντώνης εργάζεται στο Plein De Vie με εξειδίκευση στα κλασικά και μοντέρνα κουρέματα. 
                  Η προσοχή του στη λεπτομέρεια και η τεχνική του ικανότητα εξασφαλίζουν άριστα αποτελέσματα 
                  για κάθε πελάτη.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Με γνώση των σύγχρονων τάσεων και σεβασμό στις παραδοσιακές τεχνικές, προσφέρει 
                  υψηλής ποιότητας υπηρεσίες περιποίησης σε έναν φιλικό και επαγγελματικό χώρο.
                </p>
              </div>
            </BlurFade>

            {/* Qualities */}
            <BlurFade delay={0.4} inView>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualities.map((quality, index) => (
                  <motion.div
                    key={quality.text}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <quality.icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {quality.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </BlurFade>

            {/* Quote */}
            <BlurFade delay={0.6} inView>
              <motion.div
                className="relative p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute top-4 left-4 text-blue-300 text-4xl font-serif">&ldquo;</div>
                <blockquote className="text-lg text-gray-700 italic pl-8 pr-4 leading-relaxed">
                  Στόχος μου είναι κάθε πελάτης να φεύγει ικανοποιημένος με το αποτέλεσμα. 
                  Η ποιότητα και η προσοχή στη λεπτομέρεια είναι οι βασικές μου αρχές.
                </blockquote>
                <cite className="block text-right text-blue-600 font-semibold mt-4 pr-4">
                  — Αντώνης Πολυκάρπου
                </cite>
              </motion.div>
            </BlurFade>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetBarber;
