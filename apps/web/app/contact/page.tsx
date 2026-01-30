'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader2,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '01234 567890',
    href: 'tel:+441234567890',
    description: 'Mon-Sat 8am-6pm',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@tailoredsolutions.co.uk',
    href: 'mailto:info@tailoredsolutions.co.uk',
    description: '24hr response',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Message Us',
    href: 'https://wa.me/441234567890',
    description: 'Quick responses',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: MapPin,
    title: 'Service Area',
    value: 'Greater London',
    description: 'Essex, Surrey, Herts, Kent',
    gradient: 'from-gold-500 to-gold-600',
  },
];

const businessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
  { day: 'Sunday', hours: 'Emergency Only' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="relative container-luxury">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm font-medium mb-6 border border-white/10">
                <MessageCircle className="w-4 h-4" />
                Get in Touch
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Let&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Start a Conversation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 leading-relaxed"
            >
              Have a question or ready to discuss your project?
              We&apos;re here to help with all your home improvement needs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative -mt-8 z-10 pb-16">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-luxury-lg p-6 border border-slate-100 hover:shadow-elevated transition-all duration-500 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-navy-900 mb-1">{info.title}</h3>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-primary-600 hover:text-primary-700 font-medium text-lg block mb-1"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-navy-900 font-medium text-lg mb-1">{info.value}</p>
                )}
                <p className="text-slate-500 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <span className="section-label text-primary-600">Send a Message</span>
              <h2 className="font-display text-3xl md:text-4xl text-navy-900 mb-8">
                How Can We Help You?
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-luxury p-10 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-navy-900 mb-3">Message Sent!</h3>
                  <p className="text-slate-600 mb-6">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn btn-outline"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-luxury p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className="input-luxury"
                        placeholder="John Smith"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="input-luxury"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="input-luxury"
                        placeholder="07123 456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        {...register('subject')}
                        className="input-luxury"
                        placeholder="General Enquiry"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-2">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message')}
                      className="input-luxury min-h-[150px] resize-none"
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg w-full justify-center group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-luxury p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-navy-900">Business Hours</h3>
                </div>
                <div className="space-y-4">
                  {businessHours.map((item) => (
                    <div key={item.day} className="flex justify-between text-slate-600">
                      <span>{item.day}</span>
                      <span className="font-medium text-navy-900">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-6 pt-6 border-t border-slate-100">
                  Emergency callouts available 24/7 for existing clients.
                </p>
              </div>

              {/* Service Area */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-navy-900" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Service Area</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  We proudly serve Greater London and the surrounding counties:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Essex', 'Surrey', 'Hertfordshire', 'Kent', 'Buckinghamshire', 'Berkshire'].map((area) => (
                    <div key={area} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-gold-400" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                <Sparkles className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                  Ready to Start Your Project?
                </h3>
                <p className="text-slate-600 mb-6 text-sm">
                  Book a free consultation and get a detailed quote for your project.
                </p>
                <Link href="/book" className="btn btn-primary btn-md w-full justify-center group">
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
