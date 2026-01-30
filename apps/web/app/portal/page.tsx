'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, Lock, User, FileText, Calendar, MessageSquare, Bell, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function PortalPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const features = [
    {
      icon: FileText,
      title: 'View Quotations',
      description: 'Access all your quotations and invoices in one place.',
    },
    {
      icon: Calendar,
      title: 'Manage Bookings',
      description: 'View upcoming appointments and reschedule if needed.',
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Communicate directly with your project manager.',
    },
    {
      icon: Bell,
      title: 'Project Updates',
      description: 'Receive real-time updates on your project progress.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Portal login would be handled here
    alert('Client Portal Coming Soon! We are currently developing this feature.');
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
            <span className="text-white font-medium">Client Portal</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Client Portal
            </h1>
            <p className="text-xl text-white/70">
              Access your project details, quotations, and communicate with our team.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-navy-50 to-primary-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-navy-600" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-navy-900">Sign In</h2>
                  <p className="text-sm text-slate-600">Access your client dashboard</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/book" className="text-primary-600 hover:text-primary-700 font-medium">
                    Book a consultation
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-3">
                Your Project Hub
              </h2>
              <p className="text-slate-600">
                The client portal gives you complete visibility into your project status,
                documents, and direct communication with our team.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-heading font-bold text-navy-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mt-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-amber-900 mb-1">Coming Soon</h3>
                  <p className="text-sm text-amber-800">
                    We&apos;re currently developing an enhanced client portal experience. In the meantime,
                    please contact us directly for project updates or to access your documents.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="tel:01234567890"
                      className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                    >
                      <span>Call: 01234 567890</span>
                    </Link>
                    <span className="text-amber-400">|</span>
                    <Link
                      href="mailto:info@tailoredsolutions.co.uk"
                      className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                    >
                      <span>Email Us</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
