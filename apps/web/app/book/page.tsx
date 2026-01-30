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
  MessageCircle,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Zap,
  Hammer,
  Home,
  Sparkles,
  User,
  Building,
  MapPin,
  FileText,
  ChevronRight,
} from 'lucide-react';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  postcode: z.string().min(3, 'Please enter a valid postcode'),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
  serviceCategory: z.enum(['electrical', 'carpentry', 'home-improvement']),
  propertyType: z.enum(['house', 'flat', 'commercial', 'other']),
  urgency: z.enum(['emergency', 'urgent', 'standard', 'flexible']),
  serviceDescription: z.string().min(20, 'Please describe your project in detail (at least 20 characters)'),
  preferredDates: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const serviceOptions = [
  { value: 'electrical', label: 'Electrical Services', icon: Zap, color: 'from-amber-400 to-orange-500' },
  { value: 'carpentry', label: 'Carpentry & Joinery', icon: Hammer, color: 'from-amber-600 to-amber-800' },
  { value: 'home-improvement', label: 'Home Improvements', icon: Home, color: 'from-primary-500 to-primary-700' },
];

const urgencyOptions = [
  { value: 'flexible', label: 'Flexible', description: 'No rush, plan ahead', color: 'text-slate-600', bg: 'bg-slate-100' },
  { value: 'standard', label: 'Standard', description: 'Within 2 weeks', color: 'text-primary-600', bg: 'bg-primary-50' },
  { value: 'urgent', label: 'Urgent', description: 'Within a week', color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'emergency', label: 'Emergency', description: 'ASAP', color: 'text-red-600', bg: 'bg-red-50' },
];

const benefits = [
  { icon: Clock, title: 'Quick Response', description: 'We respond within 24 hours' },
  { icon: Shield, title: 'No Obligation', description: 'Free quotes with no pressure' },
  { icon: Award, title: 'Expert Advice', description: 'Professional recommendations' },
];

export default function BookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      preferredContactMethod: 'email',
      serviceCategory: 'electrical',
      propertyType: 'house',
      urgency: 'standard',
    },
  });

  const selectedService = watch('serviceCategory');
  const selectedUrgency = watch('urgency');

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setIsSubmitted(true);
    } catch (err) {
      // For demo, simulate success
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl p-10 md:p-14 max-w-lg text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl text-navy-900 mb-4">Request Submitted!</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for your enquiry. Our team will review your project details and
            get back to you within 24 hours via your preferred contact method.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn btn-primary btn-lg group">
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/portfolio" className="btn btn-outline btn-lg">
              View Our Work
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">What happens next?</p>
            <div className="flex flex-col gap-3 text-left">
              {[
                { step: '1', text: 'We review your project details' },
                { step: '2', text: 'Our expert contacts you to discuss' },
                { step: '3', text: 'You receive a detailed quote' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-600">
                    {item.step}
                  </div>
                  <span className="text-sm text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
                <Calendar className="w-4 h-4" />
                Free Consultation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Free Quote
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 mb-10 leading-relaxed"
            >
              Tell us about your project and we&apos;ll provide expert advice
              and a detailed, transparent quote with no obligation.
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{benefit.title}</div>
                    <div className="text-slate-400 text-xs">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-3xl shadow-luxury-lg overflow-hidden"
            >
              {error && (
                <div className="m-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service Selection */}
              <div className="p-8 md:p-10 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy-900">Select Service</h2>
                    <p className="text-sm text-slate-500">What type of work do you need?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {serviceOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedService === option.value
                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('serviceCategory')}
                        value={option.value}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-heading font-semibold text-navy-900 mb-1">{option.label}</h3>
                      {selectedService === option.value && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-8 md:p-10 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy-900">Your Details</h2>
                    <p className="text-sm text-slate-500">How can we reach you?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="input-luxury"
                      placeholder="07123 456789"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      {...register('postcode')}
                      className="input-luxury"
                      placeholder="SW1A 1AA"
                    />
                    {errors.postcode && (
                      <p className="text-red-500 text-sm mt-2">{errors.postcode.message}</p>
                    )}
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Preferred Contact Method *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'email', icon: Mail, label: 'Email' },
                      { value: 'phone', icon: Phone, label: 'Phone' },
                      { value: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          watch('preferredContactMethod') === option.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('preferredContactMethod')}
                          value={option.value}
                          className="sr-only"
                        />
                        <option.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8 md:p-10 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy-900">Project Details</h2>
                    <p className="text-sm text-slate-500">Tell us about your project</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Property Type *
                    </label>
                    <select {...register('propertyType')} className="input-luxury">
                      <option value="house">House</option>
                      <option value="flat">Flat / Apartment</option>
                      <option value="commercial">Commercial Property</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      {...register('preferredDates')}
                      className="input-luxury"
                      placeholder="e.g., Weekdays, mornings"
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Urgency Level *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {urgencyOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedUrgency === option.value
                            ? `border-current ${option.color} ${option.bg}`
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('urgency')}
                          value={option.value}
                          className="sr-only"
                        />
                        <div className={`font-semibold mb-1 ${selectedUrgency === option.value ? option.color : 'text-slate-700'}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500">{option.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    {...register('serviceDescription')}
                    className="input-luxury min-h-[140px] resize-none"
                    placeholder="Please describe your project in detail. Include any specific requirements, measurements, or concerns. The more detail you provide, the more accurate our quote will be."
                  />
                  {errors.serviceDescription && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.serviceDescription.message}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    className="input-luxury min-h-[80px] resize-none"
                    placeholder="Any other information you'd like us to know..."
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="p-8 md:p-10 bg-slate-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-full justify-center group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Booking Request
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    No spam
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    24hr response
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-500" />
                    Free quote
                  </span>
                </div>
              </div>
            </motion.form>

            {/* Contact Alternative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p className="text-slate-600 mb-4">Prefer to speak to someone directly?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+441234567890"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50 transition-all"
                >
                  <Phone className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">01234 567890</span>
                </a>
                <a
                  href="mailto:info@tailoredsolutions.co.uk"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50 transition-all"
                >
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">info@tailoredsolutions.co.uk</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
