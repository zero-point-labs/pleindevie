'use client';

import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Clock, Calendar, Scissors, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkingHours = () => {
  const hours = [
    { day: 'Δευτέρα', time: 'ΚΛΕΙΣΤΟ', isOpen: false },
    { day: 'Τρίτη', time: '09:00 - 19:00', isOpen: true },
    { day: 'Τετάρτη', time: '09:00 - 19:00', isOpen: true },
    { day: 'Πέμπτη', time: '09:00 - 19:00', isOpen: true },
    { day: 'Παρασκευή', time: '09:00 - 19:00', isOpen: true },
    { day: 'Σάββατο', time: '09:00 - 16:00', isOpen: true },
    { day: 'Κυριακή', time: 'ΚΛΕΙΣΤΟ', isOpen: false },
  ];

  const currentDay = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Map Sunday (0) to Saturday (6)
  const todayIndex = dayMap[currentDay];

  return (
    <section className="relative pt-20 pb-20 bg-gray-900 overflow-hidden">
      {/* Continue the background from Services section */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-900" />
        
        {/* Top fade from black for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-black" />
        
        {/* Enhanced side glows for color */}
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Additional accent lights */}
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1500" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile Optimized */}
        <BlurFade delay={0.1} inView>
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 sm:mb-4">
              Ώρες Λειτουργίας
            </h2>
            <SparklesText
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
              colors={{ first: "#3b82f6", second: "#60a5fa" }}
              sparklesCount={4}
            >
              Επισκεφθείτε Μας Σήμερα
            </SparklesText>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
              Οι πόρτες μας είναι ανοιχτές και οι μάστορες κουρείς μας είναι έτοιμοι να σας δώσουν το τέλειο look
            </p>
          </motion.div>
        </BlurFade>

        {/* Main Hours Card */}
        <BlurFade delay={0.3} inView>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card with gradient border effect - Mobile Optimized */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-500/20 p-[1px] sm:p-[2px] rounded-2xl sm:rounded-3xl">
              <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
                {/* Decorative elements - Hidden on mobile for cleaner look */}
                <div className="hidden sm:block absolute top-8 right-8 text-blue-500/20">
                  <Scissors className="w-16 h-16 lg:w-24 lg:h-24 rotate-45" />
                </div>
                <div className="hidden sm:block absolute bottom-8 left-8 text-blue-500/10">
                  <Scissors className="w-20 h-20 lg:w-32 lg:h-32 -rotate-12" />
                </div>

                {/* Hours Grid - Mobile First Design */}
                <div className="relative z-10 space-y-3">
                  {hours.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={cn(
                        "p-3 sm:p-4 rounded-xl transition-all duration-300",
                        todayIndex === index 
                          ? "bg-blue-600/20 border border-blue-500/50" 
                          : "hover:bg-gray-700/50",
                        !schedule.isOpen && "opacity-60"
                      )}
                    >
                      {/* Mobile Layout: Stack vertically on very small screens */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        
                        {/* Left side: Icon + Day */}
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg flex-shrink-0",
                            todayIndex === index 
                              ? "bg-blue-600/30 text-blue-400" 
                              : "bg-gray-700/50 text-gray-400"
                          )}>
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={cn(
                              "text-base sm:text-lg font-semibold",
                              todayIndex === index ? "text-white" : "text-gray-300"
                            )}>
                              {schedule.day}
                            </h3>
                            {todayIndex === index && (
                              <span className="text-xs text-blue-400 font-medium">ΣΗΜΕΡΑ</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Right side: Time */}
                        <div className="flex items-center gap-2 sm:gap-3 ml-11 sm:ml-0">
                          {schedule.isOpen && (
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={cn(
                            "text-sm sm:text-base lg:text-lg font-medium whitespace-nowrap",
                            schedule.isOpen 
                              ? todayIndex === index 
                                ? "text-blue-400" 
                                : "text-gray-400"
                              : "text-red-400"
                          )}>
                            {schedule.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Special Notice */}
                <motion.div
                  className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg sm:rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-300">
                      Καλωσορίζουμε επισκέψεις χωρίς ραντεβού! Συνιστώνται ραντεβού για τα Σαββατοκύριακα.
                    </p>
                  </div>
                </motion.div>

                {/* Animated border beam */}
                <BorderBeam 
                  size={400} 
                  duration={12} 
                  delay={0}
                  colorFrom="#3b82f6"
                  colorTo="#60a5fa"
                />
              </div>
            </div>
          </motion.div>
        </BlurFade>

        {/* Bottom CTA - Mobile Optimized */}
        <BlurFade delay={0.8} inView>
          <motion.div 
            className="text-center mt-8 sm:mt-10 lg:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3">Ετοιμοι για τη μεταμόρφωσή σας;</p>
            <a 
              href="tel:+35797825899"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-base sm:text-lg font-medium"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              Καλέστε Τώρα: 97 825899
            </a>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
};

export default WorkingHours;
