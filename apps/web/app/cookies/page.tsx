'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, Cookie, Settings, BarChart, Shield, Info } from 'lucide-react';

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Shield,
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: [
        'Session management cookies',
        'Security cookies for fraud prevention',
        'Load balancing cookies',
        'User preference cookies (e.g., language)',
      ],
    },
    {
      title: 'Analytics Cookies',
      icon: BarChart,
      required: false,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Google Analytics cookies',
        'Page visit tracking',
        'User journey analysis',
        'Performance monitoring',
      ],
    },
    {
      title: 'Functional Cookies',
      icon: Settings,
      required: false,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Live chat functionality',
        'Social media sharing',
        'Video player preferences',
        'Form auto-fill features',
      ],
    },
    {
      title: 'Marketing Cookies',
      icon: Cookie,
      required: false,
      description: 'These cookies are used to deliver relevant advertisements.',
      examples: [
        'Advertising tracking pixels',
        'Retargeting cookies',
        'Social media advertising',
        'Conversion tracking',
      ],
    },
  ];

  const cookieDetails = [
    {
      name: '_ga',
      provider: 'Google Analytics',
      purpose: 'Distinguishes unique users',
      duration: '2 years',
      type: 'Analytics',
    },
    {
      name: '_gid',
      provider: 'Google Analytics',
      purpose: 'Stores and counts page views',
      duration: '24 hours',
      type: 'Analytics',
    },
    {
      name: 'session_id',
      provider: 'Tailored Solutions',
      purpose: 'Maintains user session',
      duration: 'Session',
      type: 'Essential',
    },
    {
      name: 'consent',
      provider: 'Tailored Solutions',
      purpose: 'Stores cookie consent preferences',
      duration: '1 year',
      type: 'Essential',
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
            <span className="text-white font-medium">Cookie Policy</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-white/70">
              How we use cookies to enhance your experience.
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
            This Cookie Policy explains what cookies are, how Tailored Solutions uses cookies on our
            website, and your choices regarding cookies. We use cookies to enhance your browsing
            experience and to analyze our website traffic.
          </p>
        </motion.div>

        {/* What are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-blue-900 mb-2">What are Cookies?</h3>
              <p className="text-blue-800">
                Cookies are small text files that are stored on your device when you visit a website.
                They help the website remember your preferences and understand how you use the site.
                Cookies are widely used to make websites work more efficiently and provide a better
                user experience.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cookie Types */}
        <h2 className="font-heading text-2xl font-bold text-navy-900 mb-6">Types of Cookies We Use</h2>
        <div className="space-y-6 mb-12">
          {cookieTypes.map((cookie, index) => {
            const Icon = cookie.icon;
            return (
              <motion.div
                key={cookie.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-navy-900">{cookie.title}</h3>
                    </div>
                    {cookie.required && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">{cookie.description}</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Examples:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cookie.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1 h-1 rounded-full bg-primary-500" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cookie Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-6">Cookies in Detail</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">Cookie Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">Provider</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">Purpose</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cookieDetails.map((cookie, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-700">{cookie.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cookie.provider}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cookie.purpose}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cookie.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          cookie.type === 'Essential'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12"
        >
          <h3 className="font-heading text-lg font-bold text-amber-900 mb-3">Managing Your Cookie Preferences</h3>
          <div className="space-y-3 text-amber-800">
            <p>You can control and manage cookies in various ways:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies through their settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span><strong>Cookie Banner:</strong> Use our cookie consent banner when you first visit our site.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span><strong>Third-party Tools:</strong> Use browser extensions to manage cookies across websites.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Please note that blocking some cookies may impact your experience on our website.
            </p>
          </div>
        </motion.div>

        {/* Third-party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12"
        >
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">Third-Party Cookies</h3>
          <p className="text-slate-600 mb-4">
            Some cookies on our website are placed by third-party services. These include:
          </p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Google Analytics:</strong> For website traffic analysis and reporting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">•</span>
              <span><strong>Google Maps:</strong> For displaying our service area and location.</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            We do not have control over third-party cookies. Please refer to their respective privacy
            policies for more information.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center text-slate-500 text-sm"
        >
          <p>
            For more information about how we protect your data, please see our{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Privacy Policy
            </Link>.
          </p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:privacy@tailoredsolutions.co.uk" className="text-primary-600 hover:text-primary-700">
              privacy@tailoredsolutions.co.uk
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
