'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlurFade } from '@/components/ui/blur-fade';
import { SparklesText } from '@/components/ui/sparkles-text';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import { Phone, Mail, MapPin, Send, Calendar } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
    
    setIsSubmitting(false);
    alert('Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.');
  };

  const services = [
    'Πλήρες Πακέτο Περιποίησης',
    'Γενική Ερώτηση',
    'Πληροφορίες για Ραντεβού',
  ];

  return (
    <section id="contact" className="relative py-20 bg-white overflow-hidden">
      {/* Background Pattern */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full fill-gray-100 stroke-gray-200"
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
              Επικοινωνία
            </h2>
            <SparklesText
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              colors={{ first: "#3b82f6", second: "#60a5fa" }}
              sparklesCount={4}
            >
              Κλείστε την Επίσκεψή σας
            </SparklesText>
            <p className="text-lg sm:text-xl text-gray-600 mx-auto">
              Ετοιμοι για μια μεταμόρφωση; Στείλτε μας ένα μήνυμα ή κλείστε ραντεβού απευθείας
            </p>
          </motion.div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <BlurFade delay={0.2} inView>
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Το Όνομά σας
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Γιάννης Παπαδόπουλος"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Αριθμός Τηλεφώνου
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+357 99 123456"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Ε-mail Διεύθυνση
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="giannis@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Ενδιαφέρον για Υπηρεσία
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Επιλέξτε μια υπηρεσία</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Μήνυμα (Προαιρετικό)
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Πείτε μας για την προτιμώμενη ημερομηνία/ώρα ή ειδικές αιτήσεις..."
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    'Αποστολή...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Αποστολή Μηνύματος
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </BlurFade>

          {/* Contact Info & Quick Actions */}
          <BlurFade delay={0.3} inView>
            <div className="space-y-8">
              {/* Quick Booking Card */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-600 text-white rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Προτιμάτε Online Κρατήσεις;</h3>
                    <p className="text-gray-600">Κλείστε ραντεβού άμεσα</p>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    window.open('https://pleindevie.setmore.com/?fbclid=PAZXh0bgNhZW0CMTEAAadRNjEz4yqLV0E29vgg08nRtjNk9S4igPVKoQKzeztGj2I27sWxFnes7fKsPw_aem_xBfghmvbmbu272QiHfbQaA', '_blank');
                  }}
                >
                  Κλείστε Online Τώρα
                </Button>
              </motion.div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Στοιχεία Επικοινωνίας</h3>
                
                <div className="space-y-4">
                  <a
                    href="tel:+35797825899"
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Καλέστε Μας</p>
                      <p className="text-gray-600">+357 97 825899</p>
                    </div>
                  </a>

                  <a
                    href="mailto:pleindeviepleindevie@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ε-mail</p>
                      <p className="text-gray-600 break-all">pleindeviepleindevie@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Eleftherias+21+Lakatamia+2304+Nicosia+Cyprus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Επισκεφθείτε Μας</p>
                      <p className="text-gray-600">
                        Eleftherias 21, Lakatamia 2304<br />
                        Nicosia, Cyprus
                      </p>
                    </div>
                  </a>
                </div>
              </div>


            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
