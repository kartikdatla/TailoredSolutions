'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, Briefcase, MapPin, Clock, Users, Heart, TrendingUp, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '',
    message: '',
  });

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear progression paths and ongoing training opportunities.',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work alongside skilled professionals in a supportive environment.',
    },
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'Flexible schedules and competitive holiday allowance.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Work',
      description: 'Take pride in delivering exceptional craftsmanship.',
    },
  ];

  const openPositions = [
    {
      title: 'Qualified Electrician',
      type: 'Full-time',
      location: 'Greater London',
      description: 'Experienced electrician with Part P qualification for domestic and commercial projects.',
      requirements: ['NICEIC/NAPIT registered', '5+ years experience', 'Full UK driving licence'],
    },
    {
      title: 'Skilled Carpenter',
      type: 'Full-time',
      location: 'Greater London',
      description: 'Experienced carpenter for bespoke joinery and kitchen fitting projects.',
      requirements: ['City & Guilds or equivalent', '3+ years experience', 'Own tools preferred'],
    },
    {
      title: 'Multi-Trade Operative',
      type: 'Full-time',
      location: 'Greater London',
      description: 'Versatile tradesperson for general maintenance and renovation projects.',
      requirements: ['Multiple trade skills', '2+ years experience', 'Strong attention to detail'],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! We will review your application and get back to you soon.');
    setFormData({ name: '', email: '', phone: '', role: '', experience: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white font-medium">Careers</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-white/70">
              Build your career with London&apos;s trusted home improvement specialists.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-8 text-center">
            Why Work With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-slate-100 p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-bold text-navy-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-navy-900 mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </span>
                      </div>
                    </div>
                    <a
                      href="#apply"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>
                  <p className="text-slate-600 mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {position.requirements.map((req, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          id="apply"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-navy-50 to-primary-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center">
                <Send className="w-6 h-6 text-navy-600" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-navy-900">Apply Now</h2>
                <p className="text-sm text-slate-600">Submit your application to join our team</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your phone number"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                  Position Interested In *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                >
                  <option value="">Select a position</option>
                  <option value="electrician">Qualified Electrician</option>
                  <option value="carpenter">Skilled Carpenter</option>
                  <option value="multi-trade">Multi-Trade Operative</option>
                  <option value="other">Other / General Application</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience *
              </label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              >
                <option value="">Select experience level</option>
                <option value="0-2">0-2 years</option>
                <option value="2-5">2-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Tell Us About Yourself
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                placeholder="Tell us about your experience, qualifications, and why you'd like to join our team..."
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600">
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
                . We will only use your information to process your application.
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
            >
              Submit Application
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>

        {/* Contact Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center text-slate-600"
        >
          <p>
            Don&apos;t see the right position?{' '}
            <a href="mailto:careers@tailoredsolutions.co.uk" className="text-primary-600 hover:text-primary-700 font-medium">
              Send us your CV
            </a>{' '}
            and we&apos;ll keep you in mind for future opportunities.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
