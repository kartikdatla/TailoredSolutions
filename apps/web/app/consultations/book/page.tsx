'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  User,
  MapPin,
  FileText,
  Shield,
  Sparkles,
  Zap,
  Hammer,
  Home,
  AlertCircle,
} from 'lucide-react';

// Form schema
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  postcode: z.string().min(3, 'Please enter a valid postcode'),
  serviceCategory: z.enum(['electrical', 'carpentry', 'home-improvement', 'general']),
  projectDescription: z.string().min(20, 'Please describe your project (at least 20 characters)'),
  propertyType: z.enum(['house', 'flat', 'commercial', 'other']),
  urgency: z.enum(['flexible', 'standard', 'urgent', 'emergency']),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Mock available slots - in production, this would come from API
const generateMockSlots = () => {
  const slots: Array<{
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    isBooked: boolean;
  }> = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate slots for next 14 days
  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // Skip Sundays
    if (date.getDay() === 0) continue;

    // Saturday has fewer slots
    const isSaturday = date.getDay() === 6;
    const startHour = isSaturday ? 9 : 9;
    const endHour = isSaturday ? 14 : 17;

    for (let hour = startHour; hour < endHour; hour++) {
      // Random availability (70% chance of being available)
      const isBooked = Math.random() > 0.7;

      slots.push({
        id: `slot-${day}-${hour}`,
        date: new Date(date),
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        duration: 60,
        isBooked,
      });
    }
  }

  return slots;
};

const serviceOptions = [
  { value: 'electrical', label: 'Electrical Services', icon: Zap, color: 'from-amber-400 to-orange-500' },
  { value: 'carpentry', label: 'Carpentry & Joinery', icon: Hammer, color: 'from-amber-600 to-amber-800' },
  { value: 'home-improvement', label: 'Home Improvements', icon: Home, color: 'from-primary-500 to-primary-700' },
  { value: 'general', label: 'General Enquiry', icon: Sparkles, color: 'from-slate-500 to-slate-700' },
];

const urgencyOptions = [
  { value: 'flexible', label: 'Flexible', description: 'No rush' },
  { value: 'standard', label: 'Standard', description: '2-4 weeks' },
  { value: 'urgent', label: 'Urgent', description: 'Within a week' },
  { value: 'emergency', label: 'Emergency', description: 'ASAP' },
];

export default function ConsultationBookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date;
    time: string;
    meetingLink: string;
  } | null>(null);

  const slots = useMemo(() => generateMockSlots(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceCategory: 'general',
      propertyType: 'house',
      urgency: 'standard',
    },
  });

  const selectedService = watch('serviceCategory');

  // Get dates that have available slots
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    slots.forEach((slot) => {
      if (!slot.isBooked) {
        dates.add(slot.date.toDateString());
      }
    });
    return dates;
  }, [slots]);

  // Get slots for selected date
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter(
      (slot) => slot.date.toDateString() === selectedDate.toDateString() && !slot.isBooked
    );
  }, [selectedDate, slots]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty days for the start of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && availableDates.has(date.toDateString());
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleNextStep = async () => {
    if (step === 1 && selectedSlot) {
      setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['serviceCategory', 'projectDescription', 'propertyType', 'urgency']);
      if (isValid) {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const slot = slots.find((s) => s.id === selectedSlot);

      setBookingDetails({
        date: slot!.date,
        time: slot!.startTime,
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-3xl p-10 md:p-14 max-w-lg text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-display text-3xl text-navy-900 mb-4">Consultation Booked!</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your video consultation has been confirmed. You&apos;ll receive a confirmation email
            with the Microsoft Teams meeting link.
          </p>

          {/* Booking Details */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-heading font-semibold text-navy-900 mb-4">Your Appointment</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span>
                  {bookingDetails.date.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="w-5 h-5 text-primary-500" />
                <span>{bookingDetails.time} (1 hour)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Video className="w-5 h-5 text-primary-500" />
                <span>Microsoft Teams Video Call</span>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="text-left mb-8">
            <h3 className="font-heading font-semibold text-navy-900 mb-3">What to Expect</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>A professional video consultation with our expert</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Detailed discussion of your project requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Professional consultation document after the call</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Clear pricing estimates and recommendations</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn btn-primary btn-lg group">
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm font-medium mb-6 border border-white/10">
                <Video className="w-4 h-4" />
                Video Consultation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Expert Consultation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 leading-relaxed"
            >
              Schedule a free video consultation with our experts. Discuss your project,
              get professional advice, and receive a detailed consultation document.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="relative -mt-6 z-10">
        <div className="container-luxury">
          <div className="bg-white rounded-2xl shadow-luxury-lg p-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Select Time' },
                { num: 2, label: 'Project Details' },
                { num: 3, label: 'Your Info' },
              ].map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s.num
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                    </div>
                    <span
                      className={`ml-3 font-medium hidden sm:block ${
                        step >= s.num ? 'text-navy-900' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-20 sm:w-32 h-1 mx-4 rounded-full ${
                        step > s.num ? 'bg-primary-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 md:py-16">
        <div className="container-luxury">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Select Date & Time */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div className="bg-white rounded-2xl shadow-luxury p-6 border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-xl font-semibold text-navy-900">
                          Select a Date
                        </h2>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={goToPrevMonth}
                            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                          </button>
                          <span className="font-medium text-navy-900 min-w-[140px] text-center">
                            {currentMonth.toLocaleDateString('en-GB', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={goToNextMonth}
                            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          </button>
                        </div>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-slate-500 py-2"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => (
                          <button
                            key={index}
                            type="button"
                            disabled={!date || !isDateAvailable(date)}
                            onClick={() => date && handleDateSelect(date)}
                            className={`
                              aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                              ${!date ? 'invisible' : ''}
                              ${
                                date && isDateAvailable(date)
                                  ? selectedDate?.toDateString() === date.toDateString()
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                  : date
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : ''
                              }
                            `}
                          >
                            {date?.getDate()}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-primary-50 border border-primary-200" />
                          <span className="text-slate-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-100" />
                          <span className="text-slate-600">Unavailable</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="bg-white rounded-2xl shadow-luxury p-6 border border-slate-100">
                      <h2 className="font-heading text-xl font-semibold text-navy-900 mb-6">
                        {selectedDate
                          ? `Available Times - ${selectedDate.toLocaleDateString('en-GB', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                            })}`
                          : 'Select a date to see available times'}
                      </h2>

                      {selectedDate ? (
                        slotsForDate.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {slotsForDate.map((slot) => (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => handleSlotSelect(slot.id)}
                                className={`
                                  p-4 rounded-xl border-2 transition-all flex items-center gap-3
                                  ${
                                    selectedSlot === slot.id
                                      ? 'border-primary-500 bg-primary-50'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }
                                `}
                              >
                                <Clock
                                  className={`w-5 h-5 ${
                                    selectedSlot === slot.id
                                      ? 'text-primary-600'
                                      : 'text-slate-400'
                                  }`}
                                />
                                <div className="text-left">
                                  <div className="font-semibold text-navy-900">
                                    {slot.startTime}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {slot.duration} min
                                  </div>
                                </div>
                                {selectedSlot === slot.id && (
                                  <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No available slots for this date</p>
                            <p className="text-sm text-slate-400 mt-1">
                              Please select another date
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500">
                            Select a date on the calendar to view available times
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedSlot}
                      className="btn btn-primary btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-white rounded-2xl shadow-luxury p-8 border border-slate-100">
                    <h2 className="font-heading text-2xl font-semibold text-navy-900 mb-6">
                      Tell Us About Your Project
                    </h2>

                    {/* Service Category */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        What type of service do you need?
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {serviceOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedService === option.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              {...register('serviceCategory')}
                              value={option.value}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}
                              >
                                <option.icon className="w-6 h-6 text-white" />
                              </div>
                              <span className="font-medium text-navy-900">{option.label}</span>
                            </div>
                            {selectedService === option.value && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Describe your project *
                      </label>
                      <textarea
                        {...register('projectDescription')}
                        className="input-luxury min-h-[140px] resize-none"
                        placeholder="Please describe what you need help with. Include any specific requirements, measurements, or concerns..."
                      />
                      {errors.projectDescription && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.projectDescription.message}
                        </p>
                      )}
                    </div>

                    {/* Property Type & Urgency */}
                    <div className="grid sm:grid-cols-2 gap-6">
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
                          Urgency *
                        </label>
                        <select {...register('urgency')} className="input-luxury">
                          {urgencyOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label} - {opt.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn btn-primary btn-lg group"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-white rounded-2xl shadow-luxury p-8 border border-slate-100">
                    <h2 className="font-heading text-2xl font-semibold text-navy-900 mb-6">
                      Your Contact Information
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6">
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

                    {/* Booking Summary */}
                    <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                      <h3 className="font-heading font-semibold text-navy-900 mb-4">
                        Booking Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Calendar className="w-5 h-5 text-primary-500" />
                          <span>
                            {selectedDate?.toLocaleDateString('en-GB', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Clock className="w-5 h-5 text-primary-500" />
                          <span>
                            {slots.find((s) => s.id === selectedSlot)?.startTime} (1 hour)
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Video className="w-5 h-5 text-primary-500" />
                          <span>Microsoft Teams Video Call</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
                      <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>
                        By booking, you agree to our consultation terms. Your information is
                        secure and will only be used to contact you about your consultation.
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-navy-900 mb-4">
              What&apos;s Included in Your Consultation
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every consultation includes a professional video call and a detailed document
              with expert recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: 'Video Consultation',
                description:
                  'A 1-hour Microsoft Teams call with our expert to discuss your project in detail.',
              },
              {
                icon: FileText,
                title: 'Professional Document',
                description:
                  'Receive a detailed consultation document with technical assessments and clear recommendations.',
              },
              {
                icon: Shield,
                title: 'Expert Guidance',
                description:
                  'Get professional advice from certified electricians, carpenters, and builders.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-luxury border border-slate-100"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
