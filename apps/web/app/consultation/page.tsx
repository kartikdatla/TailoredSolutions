'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Zap,
  Hammer,
  Home,
  Sparkles,
  Shield,
  Award,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Info,
} from 'lucide-react';

// Types
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DaySlots {
  date: Date;
  slots: TimeSlot[];
}

// Mock data - would come from API
const generateMockSlots = (startDate: Date): DaySlots[] => {
  const days: DaySlots[] = [];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const daySlots = times.map((time, idx) => ({
      id: `${date.toISOString()}-${time}`,
      time,
      available: Math.random() > 0.3, // Randomly make some slots unavailable
    }));

    days.push({ date, slots: daySlots });
  }

  return days;
};

const serviceOptions = [
  { value: 'electrical', label: 'Electrical Services', icon: Zap, color: 'from-amber-400 to-orange-500' },
  { value: 'carpentry', label: 'Carpentry & Joinery', icon: Hammer, color: 'from-amber-600 to-amber-800' },
  { value: 'home-improvement', label: 'Home Improvements', icon: Home, color: 'from-primary-500 to-primary-700' },
  { value: 'general', label: 'General Enquiry', icon: MessageCircle, color: 'from-slate-500 to-slate-700' },
];

const steps = [
  { id: 1, title: 'Select Service', icon: Sparkles },
  { id: 2, title: 'Choose Date & Time', icon: Calendar },
  { id: 3, title: 'Your Details', icon: User },
  { id: 4, title: 'Confirmation', icon: CheckCircle },
];

export default function ConsultationBookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form state
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    propertyType: 'house',
    projectDescription: '',
  });

  // Calendar state
  const [calendarStart, setCalendarStart] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);

  useEffect(() => {
    // In production, fetch available slots from API
    setAvailableSlots(generateMockSlots(calendarStart));
  }, [calendarStart]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 flex items-center justify-center p-4">
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

          <h1 className="font-display text-3xl text-navy-900 mb-4">Consultation Booked!</h1>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Date & Time</div>
                <div className="font-semibold text-navy-900">
                  {selectedDate && formatDate(selectedDate)} at {selectedTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Meeting Type</div>
                <div className="font-semibold text-navy-900">Microsoft Teams Video Call</div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed">
            You&apos;ll receive a confirmation email with your Microsoft Teams meeting link shortly.
            Our Consultation Agent will join the call to transcribe and document everything discussed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn btn-primary btn-lg group">
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Need to change your booking?{' '}
              <Link href="/contact" className="text-primary-600 hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
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
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm font-medium mb-6 border border-white/10">
                <Video className="w-4 h-4" />
                Free Video Consultation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight"
            >
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Consultation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 leading-relaxed"
            >
              Schedule a free video consultation via Microsoft Teams. Our expert will discuss your project
              and you&apos;ll receive a detailed consultation document afterwards.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b border-slate-100 sticky top-[72px] z-40">
        <div className="container-luxury py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-3 ${
                    currentStep >= step.id ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 md:w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12 md:py-16">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl text-navy-900 mb-3">
                      What can we help you with?
                    </h2>
                    <p className="text-slate-600">
                      Select the type of service you&apos;re interested in
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedService(option.value)}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                          selectedService === option.value
                            ? 'border-primary-500 bg-primary-50 shadow-lg'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                          <option.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-navy-900 mb-2">
                          {option.label}
                        </h3>
                        {selectedService === option.value && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-8">
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedService}
                      className="btn btn-primary btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl text-navy-900 mb-3">
                      Choose your preferred time
                    </h2>
                    <p className="text-slate-600">
                      Select a convenient date and time for your video consultation
                    </p>
                  </div>

                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => {
                        const newDate = new Date(calendarStart);
                        newDate.setDate(newDate.getDate() - 7);
                        if (newDate >= new Date()) setCalendarStart(newDate);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="font-heading font-semibold text-navy-900">
                      {new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(calendarStart)}
                    </span>
                    <button
                      onClick={() => {
                        const newDate = new Date(calendarStart);
                        newDate.setDate(newDate.getDate() + 7);
                        setCalendarStart(newDate);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
                    {availableSlots.map((day) => {
                      const hasAvailable = day.slots.some(s => s.available);
                      const isSelected = selectedDate?.toDateString() === day.date.toDateString();

                      return (
                        <button
                          key={day.date.toISOString()}
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedTime('');
                          }}
                          disabled={!hasAvailable}
                          className={`p-3 rounded-xl text-center transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-lg'
                              : hasAvailable
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(day.date)}
                          </div>
                          <div className="text-lg font-bold">{day.date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="font-heading font-semibold text-navy-900 mb-4">
                        Available times for {formatDate(selectedDate)}
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {availableSlots
                          .find(d => d.date.toDateString() === selectedDate.toDateString())
                          ?.slots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-3 rounded-xl font-medium transition-all ${
                                selectedTime === slot.time
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : slot.available
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Info Box */}
                  <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-primary-800">
                      <strong>Video Consultation:</strong> Your consultation will be conducted via Microsoft Teams.
                      You&apos;ll receive a meeting link via email. Our Consultation Agent will automatically
                      transcribe the call and generate a detailed document for you.
                    </div>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedDate || !selectedTime}
                      className="btn btn-primary btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl text-navy-900 mb-3">
                      Your Details
                    </h2>
                    <p className="text-slate-600">
                      Please provide your contact information
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-luxury"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-luxury"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-luxury"
                          placeholder="07123 456789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          value={formData.postcode}
                          onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                          className="input-luxury"
                          placeholder="SW1A 1AA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Property Type *
                        </label>
                        <select
                          value={formData.propertyType}
                          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                          className="input-luxury"
                        >
                          <option value="house">House</option>
                          <option value="flat">Flat / Apartment</option>
                          <option value="commercial">Commercial Property</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Brief Project Description *
                      </label>
                      <textarea
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        className="input-luxury min-h-[120px] resize-none"
                        placeholder="Please briefly describe what you'd like to discuss in the consultation..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!formData.name || !formData.email || !formData.phone || !formData.postcode || !formData.projectDescription}
                      className="btn btn-primary btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Review Booking</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl text-navy-900 mb-3">
                      Confirm Your Booking
                    </h2>
                    <p className="text-slate-600">
                      Please review your consultation details
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Booking Summary */}
                    <div className="p-8 border-b border-slate-100">
                      <h3 className="font-heading font-semibold text-navy-900 mb-6">
                        Consultation Summary
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Date & Time</div>
                            <div className="font-semibold text-navy-900">
                              {selectedDate && formatDate(selectedDate)}
                            </div>
                            <div className="text-primary-600 font-medium">{selectedTime}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Meeting Type</div>
                            <div className="font-semibold text-navy-900">Microsoft Teams</div>
                            <div className="text-slate-600 text-sm">Video Consultation</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            {serviceOptions.find(s => s.value === selectedService)?.icon && (
                              <Sparkles className="w-6 h-6 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Service Type</div>
                            <div className="font-semibold text-navy-900">
                              {serviceOptions.find(s => s.value === selectedService)?.label}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Duration</div>
                            <div className="font-semibold text-navy-900">60 minutes</div>
                            <div className="text-slate-600 text-sm">Free consultation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="p-8 bg-slate-50">
                      <h3 className="font-heading font-semibold text-navy-900 mb-4">
                        Your Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Name:</span>
                          <span className="ml-2 text-navy-900 font-medium">{formData.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Email:</span>
                          <span className="ml-2 text-navy-900 font-medium">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Phone:</span>
                          <span className="ml-2 text-navy-900 font-medium">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Postcode:</span>
                          <span className="ml-2 text-navy-900 font-medium">{formData.postcode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What to Expect */}
                  <div className="bg-gradient-to-br from-primary-50 to-gold-50 rounded-2xl p-8">
                    <h3 className="font-heading font-semibold text-navy-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-500" />
                      What to Expect
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'You\'ll receive a confirmation email with your Microsoft Teams meeting link',
                        'Our expert will join the call to discuss your project in detail',
                        'A Consultation Agent will automatically transcribe the conversation',
                        'After the call, you\'ll receive a detailed consultation document with recommendations and costings',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="container-luxury">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-slate-600">
              <Shield className="w-6 h-6 text-green-500" />
              <span className="font-medium">Free Consultation</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Award className="w-6 h-6 text-gold-500" />
              <span className="font-medium">Expert Advice</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <FileText className="w-6 h-6 text-primary-500" />
              <span className="font-medium">Detailed Documentation</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Video className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Video Call via Teams</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
