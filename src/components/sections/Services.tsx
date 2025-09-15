'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Scissors, Sparkles, Clock, Euro } from 'lucide-react';

const Services = () => {
  // Single comprehensive package
  const mainService = {
    title: 'Πλήρες Πακέτο Περιποίησης',
    description: 'Ολοκληρωμένο πακέτο περιποίησης για άντρες με όλα τα απαραίτητα.',
    price: '€13',
    duration: '45-60 λεπτά',
    baseFeatures: [
      'Κοπή Μαλλιών με Ακρίβεια',
      'Κούρεμα & Σχηματισμός Γενιού', 
      'Σαμπουάν & Μαλακτικό',
      'Styling με Premium Προϊόντα',
      'Ζεστή Πετσέτα',
      'Τελειωτικές Πινελιές'
    ],
    extraServices: [
      'Μάσκα Προσώπου',
      'Κερί Styling', 
      'Βαθύς Καθαρισμός',
      'Ενυδατική Θεραπεία'
    ]
  };

  return (
    <section 
      id="services"
      className="relative min-h-screen pt-20 pb-0 bg-gray-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        
        {/* Animated blue accent lights */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Bottom fade to black for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BlurFade delay={0.1} inView>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Οι Υπηρεσίες Μας
              </h2>
              <SparklesText
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
                colors={{ first: "#3b82f6", second: "#60a5fa" }}
                sparklesCount={4}
              >
                Δημιουργημένες Για Εσάς
              </SparklesText>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed text-center">
                Ζήστε την τέχνη της περιποίησης με τις premium υπηρεσίες μας, παραδομένες από κουρείς-μάστορες που φροντίζουν κάθε λεπτομέρεια.
              </p>
            </motion.div>
          </BlurFade>
        </div>

        {/* Single Service Showcase */}
        <div className="max-w-5xl mx-auto">
          <BlurFade delay={0.3} inView>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-500/20 p-[2px] rounded-3xl">
                <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                  
                  {/* Service Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                      <Sparkles className="w-4 h-4" />
                      ΣΥΝΟΛΙΚΟ ΠΑΚΕΤΟ
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 px-2">{mainService.title}</h3>
                    <div className="w-full px-4 mb-8">
                      <p className="text-xl text-gray-400 leading-relaxed text-center max-w-none">
                        {mainService.description}
                      </p>
                    </div>
                    
                    {/* Price & Duration */}
                    <div className="flex items-center justify-center gap-8 mb-8">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue-400 justify-center mb-1">
                          <Euro className="w-5 h-5" />
                        </div>
                        <div className="text-4xl md:text-5xl font-bold text-white">{mainService.price.replace('€', '')}</div>
                        <div className="text-sm text-gray-500">Συνολικό Κόστος</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue-400 justify-center mb-1">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white">{mainService.duration}</div>
                        <div className="text-sm text-gray-500">Διάρκεια</div>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Base Services */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-blue-500" />
                        Βασικές Υπηρεσίες
                      </h4>
                      <ul className="space-y-3">
                        {mainService.baseFeatures.map((feature, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-center text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Extra Services */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        Πρόσθετες Υπηρεσίες
                      </h4>
                      <ul className="space-y-3">
                        {mainService.extraServices.map((extra, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-center text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
                            <span>{extra}</span>
                            <span className="text-xs text-blue-400 ml-2 font-medium">(κατά περίπτωση)</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Value Proposition */}
                  <motion.div 
                    className="mt-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <p className="text-blue-300 font-medium">
                      💡 Μία τιμή, όλες οι υπηρεσίες - Καμία έκπληξη, μόνο αποτέλεσμα!
                    </p>
                  </motion.div>

                  {/* Animated border beam */}
                  <BorderBeam 
                    size={500} 
                    duration={15} 
                    delay={0}
                    colorFrom="#3b82f6"
                    colorTo="#8b5cf6"
                  />
                </div>
              </div>
            </motion.div>
          </BlurFade>
        </div>

        {/* Bottom CTA */}
        <BlurFade delay={1} inView>
          <motion.div 
            className="text-center mt-16 pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-gray-400 mb-6">
              Ένα πλήρες πακέτο που καλύπτει όλες τις ανάγκες περιποίησης σας. Απλά, οικονομικά, αποτελεσματικά.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  window.open('https://pleindevie.setmore.com/?fbclid=PAZXh0bgNhZW0CMTEAAadRNjEz4yqLV0E29vgg08nRtjNk9S4igPVKoQKzeztGj2I27sWxFnes7fKsPw_aem_xBfghmvbmbu272QiHfbQaA', '_blank');
                }}
              >
                <Scissors className="mr-2 h-5 w-5" />
                Κλείστε Τώρα
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-white text-black hover:bg-gray-100 hover:border-gray-200"
                onClick={() => {
                  window.location.href = 'tel:+35797825899';
                }}
              >
                Καλέστε Για Συμβουλευτική
              </Button>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
};


export default Services;