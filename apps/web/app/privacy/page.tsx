'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, Shield, Lock, Eye, Database, Mail, Clock } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal information you provide (name, email, phone, address)',
        'Project details and requirements discussed during consultations',
        'Communication records including emails and phone calls',
        'Payment information for transactions',
        'Website usage data through cookies and analytics',
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'To provide and improve our services',
        'To communicate about your projects and bookings',
        'To send quotations and invoices',
        'To respond to your inquiries and support requests',
        'To send relevant updates and marketing (with your consent)',
        'To comply with legal obligations',
      ],
    },
    {
      title: 'Data Protection',
      icon: Lock,
      content: [
        'We use industry-standard encryption to protect your data',
        'Access to personal data is restricted to authorized personnel only',
        'We regularly review and update our security practices',
        'We do not sell your personal information to third parties',
        'Data is stored securely on UK/EU-based servers',
      ],
    },
    {
      title: 'Your Rights',
      icon: Shield,
      content: [
        'Right to access your personal data',
        'Right to rectification of inaccurate data',
        'Right to erasure ("right to be forgotten")',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object to processing',
        'Right to withdraw consent at any time',
      ],
    },
    {
      title: 'Data Retention',
      icon: Clock,
      content: [
        'Project records are retained for 6 years for warranty and legal purposes',
        'Marketing consent records are kept until withdrawn',
        'Website analytics data is anonymized after 26 months',
        'You can request deletion of your data at any time (subject to legal requirements)',
      ],
    },
    {
      title: 'Contact Us',
      icon: Mail,
      content: [
        'For any privacy-related questions or requests, contact us:',
        'Email: privacy@tailoredsolutions.co.uk',
        'Phone: 01234 567890',
        'Post: Tailored Solutions, Greater London',
        'We aim to respond to all requests within 30 days',
      ],
    },
  ];

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
            <span className="text-white font-medium">Privacy Policy</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/70">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-white/50 mt-4">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-slate-600 leading-relaxed">
            Tailored Solutions (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our services or visit our website. We comply with the UK General Data
            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-navy-900">{section.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cookies Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <h3 className="font-heading text-lg font-bold text-amber-900 mb-3">Cookies</h3>
          <p className="text-amber-800 mb-4">
            Our website uses cookies to enhance your browsing experience. For more information
            about how we use cookies and how to manage your preferences, please see our{' '}
            <Link href="/cookies" className="text-amber-600 underline hover:text-amber-700">
              Cookie Policy
            </Link>.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-slate-500 text-sm"
        >
          <p>
            This policy may be updated from time to time. We will notify you of any significant
            changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
