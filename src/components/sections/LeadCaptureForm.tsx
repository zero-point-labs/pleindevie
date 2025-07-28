'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckIcon } from '@/assets/icons/CheckIcon';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BorderBeam } from '@/components/ui/border-beam';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BlurFade } from '@/components/ui/blur-fade';
import { GridPattern } from '@/components/ui/grid-pattern';
import { useInView } from '@/hooks/useInView';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  leadCaptureFormSchema,
  leadCaptureFormDefaults,
  projectTypeOptions,
  budgetOptions,
  timelineOptions,
  type LeadCaptureFormData,
} from '@/lib/validation';
import { cn } from '@/lib/utils';

interface LeadCaptureFormProps {
  className?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ 
  className = '' 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { trackFormSubmit } = useAnalytics();
  const { ref: formRef } = useInView({ 
    trackSection: 'lead-capture-form',
    threshold: 0.3
  });

  const form = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureFormSchema),
    defaultValues: leadCaptureFormDefaults,
  });

  // Note: Form view is automatically tracked by useInView hook

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log('Submitting form data directly to API');
      const response = await fetch('/api/leads/appwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Track successful form submission
      await trackFormSubmit({
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline
      });

      setSubmitSuccess(true);
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={formRef}
      id="contact"
      className={cn("relative py-8 sm:py-12 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50", className)}
    >
      {/* Background Pattern */}
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className="opacity-20"
      />
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-amber-400/15 to-yellow-400/15 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full mb-4 sm:mb-6"
            >
              <span className="text-amber-600 font-semibold text-sm">✨ FREE CONSULTATION</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Start Your Project Today
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Fill out the form below and we&apos;ll get back to you within 24 hours to start planning your dream renovation.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-16 items-start">
          {/* Benefits Section */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <BlurFade delay={0.2}>
              <NeonGradientCard 
                neonColors={{ firstColor: "#fbbf24", secondColor: "#f59e0b" }}
                className="relative"
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                    Transform Your Space with 
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Expert Design</span>
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Get personalized renovation advice from our award-winning team. No pressure, just professional insights to bring your vision to life.
                  </p>
                </div>
              </NeonGradientCard>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="space-y-4 sm:space-y-6">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">What&apos;s Included:</h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {[
                    { icon: '🏆', text: '30-day transformation guarantee', highlight: true },
                    { icon: '🎨', text: 'Free 3D design visualization', highlight: true },
                    { icon: '💰', text: 'Transparent pricing - no surprises' },
                    { icon: '👨‍💼', text: 'Dedicated project manager' }
                  ].map((benefit, index) => (
                    <BlurFade key={index} delay={0.4 + index * 0.1}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={cn(
                          "flex items-center p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer group",
                          benefit.highlight 
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-md hover:shadow-lg' 
                            : 'bg-white/80 backdrop-blur border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                        )}
                      >
                        <span className="text-xl sm:text-2xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</span>
                        <span className={cn(
                          "font-medium text-sm sm:text-base transition-colors duration-300",
                          benefit.highlight ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                        )}>
                          {benefit.text}
                        </span>
                      </motion.div>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.6}>
              <NeonGradientCard 
                borderSize={2}
                borderRadius={16}
                neonColors={{ firstColor: "#ff6b35", secondColor: "#f7931e" }}
                className="relative overflow-hidden"
              >
                <div className="p-4 sm:p-6 relative">
                  <div className="flex items-center mb-3">
                    <span className="text-xl sm:text-2xl mr-3">⚡</span>
                    <span className="font-bold text-orange-600 text-xs sm:text-sm uppercase tracking-wide">Limited Time Offer</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    Book this month and save <span className="text-orange-600 font-bold">15%</span> on your project
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-2">Plus free design consultation worth $500</p>
                </div>
              </NeonGradientCard>
            </BlurFade>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <BlurFade delay={0.4}>
              <div className="relative">
                <NeonGradientCard 
                  borderSize={3}
                  borderRadius={20}
                  neonColors={{ firstColor: "#fbbf24", secondColor: "#f59e0b" }}
                  className="relative"
                >
                  <BorderBeam 
                    size={300}
                    duration={12}
                    colorFrom="#fbbf24"
                    colorTo="#f59e0b"
                  />
                  
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Full Name *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      placeholder="Enter your full name"
                                      className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Email Address *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      type="email"
                                      placeholder="Enter your email address"
                                      className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Phone and Project Type Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Phone Number *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      type="tel"
                                      placeholder="(555) 123-4567"
                                      className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Project Type *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white">
                                        <SelectValue placeholder="Select project type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {projectTypeOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Budget and Timeline Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Budget Range *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white">
                                        <SelectValue placeholder="Select budget range" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {budgetOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Timeline *</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 focus:border-amber-500 focus:ring-amber-500/20 h-10 sm:h-12 transition-all duration-300 group-hover:bg-white">
                                        <SelectValue placeholder="Select timeline" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timelineOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Message Field */}
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm uppercase tracking-wide">Additional Details</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Textarea
                                    placeholder="Tell us more about your project..."
                                    className="bg-white/90 backdrop-blur border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 min-h-[100px] sm:min-h-[120px] resize-none transition-all duration-300 group-hover:bg-white"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Checkboxes */}
                        <div className="space-y-3 sm:space-y-4">
                          <FormField
                            control={form.control}
                            name="termsAccepted"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 bg-white text-amber-600 focus:ring-amber-500 focus:ring-offset-0 transition-colors duration-200"
                                    checked={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    I accept the{' '}
                                    <a href="/terms" className="text-amber-600 hover:text-amber-700 font-medium underline decoration-amber-200 hover:decoration-amber-300 transition-colors duration-200">
                                      terms and conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-amber-600 hover:text-amber-700 font-medium underline decoration-amber-200 hover:decoration-amber-300 transition-colors duration-200">
                                      privacy policy
                                    </a>
                                    *
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="marketingConsent"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 bg-white text-amber-600 focus:ring-amber-500 focus:ring-offset-0 transition-colors duration-200"
                                    checked={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    I&apos;d like to receive updates about special offers and design tips
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 sm:pt-6">
                          <ShimmerButton
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 sm:py-4 text-base sm:text-lg font-bold text-white relative overflow-hidden"
                            shimmerSize="0.1em"
                            shimmerDuration="2s"
                            background="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                                Submitting...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <span>Get My Free Consultation</span>
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            )}
                          </ShimmerButton>
                        </div>

                        {/* Success Message */}
                        {submitSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl"
                          >
                            <p className="text-green-600 text-xs sm:text-sm font-medium flex items-center">
                              <CheckIcon className="w-4 h-4 mr-2" />
                              Thank you! We&apos;ve received your information and will contact you within 24 hours to schedule your free consultation.
                            </p>
                          </motion.div>
                        )}

                        {/* Error Message */}
                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl"
                          >
                            <p className="text-red-600 text-xs sm:text-sm font-medium flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {submitError}
                            </p>
                          </motion.div>
                        )}
                      </form>
                    </Form>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-xs text-gray-500 text-center leading-relaxed mt-4 sm:mt-6 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      We respect your privacy. Your information will never be shared with third parties.
                    </motion.p>
                  </div>
                </NeonGradientCard>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
