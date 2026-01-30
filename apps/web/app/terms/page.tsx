'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, FileText, AlertCircle, CheckCircle, Scale, Clock, Shield } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing our website or using our services, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.',
        'These terms apply to all visitors, users, and customers of Tailored Solutions.',
      ],
    },
    {
      title: 'Services Description',
      icon: FileText,
      content: [
        'Tailored Solutions provides electrical, carpentry, and home improvement services in Greater London and surrounding areas.',
        'All services are subject to availability and a detailed assessment of requirements.',
        'Quotations provided are estimates and may change based on actual work requirements discovered during the project.',
        'We reserve the right to refuse service at our discretion.',
      ],
    },
    {
      title: 'Quotations & Pricing',
      icon: Scale,
      content: [
        'All quotations are valid for 30 days from the date of issue unless otherwise stated.',
        'Prices quoted are inclusive of labour but may exclude materials unless specified.',
        'Additional work requested beyond the original scope will be quoted separately.',
        'VAT will be applied where applicable at the prevailing rate.',
        'We reserve the right to adjust pricing for unforeseen circumstances discovered during work.',
      ],
    },
    {
      title: 'Payment Terms',
      icon: Clock,
      content: [
        'A deposit may be required for larger projects, typically 25-30% of the total quoted amount.',
        'Balance payment is due upon satisfactory completion of work.',
        'We accept bank transfer, cash, and card payments.',
        'Late payments may incur interest at 8% above the Bank of England base rate.',
        'Work may be suspended if payment terms are not adhered to.',
      ],
    },
    {
      title: 'Warranties & Guarantees',
      icon: Shield,
      content: [
        'All workmanship is guaranteed for a minimum of 12 months from completion.',
        'Electrical work is certified and compliant with Part P Building Regulations.',
        'Warranties do not cover damage caused by misuse, neglect, or third-party interference.',
        'Material warranties are as provided by the manufacturer.',
        'Claims under warranty must be reported within 7 days of discovery.',
      ],
    },
    {
      title: 'Limitations of Liability',
      icon: AlertCircle,
      content: [
        'We maintain comprehensive public liability insurance for your protection.',
        'Our liability is limited to the value of the work undertaken.',
        'We are not liable for indirect, consequential, or incidental damages.',
        'Force majeure events are excluded from liability.',
        'Pre-existing defects not disclosed prior to work commencement are excluded.',
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
            <span className="text-white font-medium">Terms of Service</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/70">
              The terms and conditions governing our services.
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
            Welcome to Tailored Solutions. These Terms of Service (&quot;Terms&quot;) govern your use of our
            website and services. Please read these terms carefully before engaging our services.
            By booking a consultation or accepting a quotation, you agree to be bound by these Terms.
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
                    <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-navy-600" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-navy-900">{section.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-navy-500 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cancellation Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <h3 className="font-heading text-lg font-bold text-amber-900 mb-3">Cancellation Policy</h3>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Consultations can be cancelled or rescheduled with 24 hours notice at no charge.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Cancellations with less than 24 hours notice may incur a call-out fee.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Project cancellations after work has commenced will be charged for completed work plus materials.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span>Deposits are non-refundable once work has been scheduled.</span>
            </li>
          </ul>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6"
        >
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">Governing Law</h3>
          <p className="text-slate-600">
            These Terms shall be governed by and construed in accordance with the laws of England and Wales.
            Any disputes arising from these terms or our services shall be subject to the exclusive
            jurisdiction of the courts of England and Wales.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-slate-500 text-sm"
        >
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:info@tailoredsolutions.co.uk" className="text-primary-600 hover:text-primary-700">
              info@tailoredsolutions.co.uk
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
