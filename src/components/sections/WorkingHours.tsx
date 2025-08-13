'use client';

import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Clock, Calendar, Scissors, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkingHours = () => {
  const hours = [
    { day: 'Monday', time: '09 AM - 07 PM', isOpen: true },
    { day: 'Tuesday', time: '09 AM - 07 PM', isOpen: true },
    { day: 'Wednesday', time: '09 AM - 07 PM', isOpen: true },
    { day: 'Thursday', time: '09 AM - 07 PM', isOpen: true },
    { day: 'Friday', time: '09 AM - 07 PM', isOpen: true },
    { day: 'Saturday', time: '09 AM - 04 PM', isOpen: true },
    { day: 'Sunday', time: 'CLOSED', isOpen: false },
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
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
              Open Hours
            </h2>
            <SparklesText
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
              colors={{ first: "#3b82f6", second: "#60a5fa" }}
              sparklesCount={4}
            >
              Visit Us Today
            </SparklesText>
            <p className="text-lg sm:text-xl text-gray-400 mx-auto leading-relaxed">
              Our doors are open and our master barbers are ready to give you the perfect look
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
            {/* Card with gradient border effect */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-500/20 p-[2px] rounded-3xl">
              <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 text-blue-500/20">
                  <Scissors className="w-24 h-24 rotate-45" />
                </div>
                <div className="absolute bottom-8 left-8 text-blue-500/10">
                  <Scissors className="w-32 h-32 -rotate-12" />
                </div>

                {/* Hours Grid */}
                <div className="relative z-10 space-y-4">
                  {hours.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                        todayIndex === index 
                          ? "bg-blue-600/20 border border-blue-500/50" 
                          : "hover:bg-gray-700/50",
                        !schedule.isOpen && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          todayIndex === index 
                            ? "bg-blue-600/30 text-blue-400" 
                            : "bg-gray-700/50 text-gray-400"
                        )}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-lg font-semibold",
                            todayIndex === index ? "text-white" : "text-gray-300"
                          )}>
                            {schedule.day}
                          </h3>
                          {todayIndex === index && (
                            <span className="text-xs text-blue-400 font-medium">TODAY</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {schedule.isOpen && (
                          <Clock className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={cn(
                          "text-lg font-medium",
                          schedule.isOpen 
                            ? todayIndex === index 
                              ? "text-blue-400" 
                              : "text-gray-400"
                            : "text-red-400"
                        )}>
                          {schedule.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Special Notice */}
                <motion.div
                  className="mt-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <p className="text-gray-300">
                      Walk-ins welcome! Appointments recommended for weekends.
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

        {/* Bottom CTA */}
        <BlurFade delay={0.8} inView>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-400 mb-2">Ready for your transformation?</p>
            <a 
              href="tel:+35797825899"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium"
            >
              <Clock className="w-5 h-5" />
              Call Now: 97 825899
            </a>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
};

export default WorkingHours;
