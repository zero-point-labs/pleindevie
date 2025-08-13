'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Scissors, Sparkles, Clock, Euro } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Classic Haircut',
      description: 'Precision cutting with traditional barbering techniques, finished with hot towel and styling.',
      price: '€25',
      duration: '30 min',
      features: ['Consultation', 'Shampoo & Condition', 'Hot Towel Service', 'Styling'],
      popular: false,
    },
    {
      title: 'Beard Trim & Shape',
      description: 'Expert beard grooming including trimming, shaping, and conditioning for the perfect look.',
      price: '€20',
      duration: '25 min',
      features: ['Beard Analysis', 'Precision Trimming', 'Hot Towel', 'Beard Oil Treatment'],
      popular: false,
    },
    {
      title: 'Premium Experience',
      description: 'The complete grooming package with haircut, beard trim, and luxury treatments.',
      price: '€45',
      duration: '60 min',
      features: ['Full Haircut', 'Beard Grooming', 'Face Mask', 'Head Massage', 'Premium Products'],
      popular: true,
    },
    {
      title: 'Hot Shave',
      description: 'Traditional hot towel shave with straight razor for the smoothest finish.',
      price: '€30',
      duration: '40 min',
      features: ['Pre-Shave Oil', 'Hot Towel Prep', 'Straight Razor', 'Aftershave Treatment'],
      popular: false,
    },
    {
      title: 'Hair Styling',
      description: 'Professional styling for special occasions or to achieve your desired look.',
      price: '€15',
      duration: '20 min',
      features: ['Style Consultation', 'Premium Products', 'Blow Dry', 'Finishing Touch'],
      popular: false,
    },
    {
      title: 'Face Mask Treatment',
      description: 'Rejuvenating facial treatment to refresh and revitalize your skin.',
      price: '€25',
      duration: '30 min',
      features: ['Deep Cleansing', 'Exfoliation', 'Mask Application', 'Moisturizing'],
      popular: false,
    },
  ];

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
                Our Services
              </h2>
              <SparklesText
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
                colors={{ first: "#3b82f6", second: "#60a5fa" }}
                sparklesCount={4}
              >
                Crafted For You
              </SparklesText>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed text-center">
                Experience the art of grooming with our premium services, delivered by master barbers who take pride in every detail.
              </p>
            </motion.div>
          </BlurFade>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <BlurFade key={service.title} delay={0.2 + index * 0.1} inView>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <ServiceCard service={service} />
                  <BorderBeam size={200} duration={12} delay={index * 2} />
                </div>
              </motion.div>
            </BlurFade>
          ))}
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
              Can&apos;t find what you&apos;re looking for? We offer custom services tailored to your needs.
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
                Book Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-white text-black hover:bg-gray-100 hover:border-gray-200"
                onClick={() => {
                  window.location.href = 'tel:+35797825899';
                }}
              >
                Call for Consultation
              </Button>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
};

// Service Card Component
interface Service {
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  popular: boolean;
}

const ServiceCard = ({ service }: { service: Service }) => (
  <div className="p-6 h-full flex flex-col">
    {service.popular && (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
        <Sparkles className="w-3 h-3" />
        PREMIUM
      </div>
    )}
    
    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
    <p className="text-gray-400 mb-4 flex-grow">{service.description}</p>
    
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-blue-400">
          <Euro className="w-4 h-4" />
          <span className="text-2xl font-bold text-white">{service.price.replace('€', '')}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{service.duration}</span>
        </div>
      </div>
    </div>
    
    <ul className="space-y-2 mb-6">
      {service.features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-center text-gray-300 text-sm">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
          {feature}
        </li>
      ))}
    </ul>
    

  </div>
);

export default Services;