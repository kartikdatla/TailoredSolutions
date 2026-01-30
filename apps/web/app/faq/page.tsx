'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, ChevronDown, HelpCircle, Zap, Hammer, HomeIcon, Clock, PoundSterling, Shield } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ElementType;
  color: string;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'General Questions',
    icon: HelpCircle,
    color: 'primary',
    faqs: [
      {
        question: 'What areas do you cover?',
        answer: 'We provide services across Greater London and the surrounding areas including Essex, Surrey, Hertfordshire, and Kent. For larger projects, we may extend our coverage - please contact us to discuss your specific location.',
      },
      {
        question: 'Are you fully insured?',
        answer: 'Yes, we carry comprehensive public liability insurance up to £5 million and professional indemnity insurance. We can provide certificates upon request.',
      },
      {
        question: 'Do you offer free consultations?',
        answer: 'Yes! We offer free initial consultations for all projects. During the consultation, we\'ll discuss your requirements, assess the work needed, and provide a detailed quotation with no obligation.',
      },
      {
        question: 'What are your working hours?',
        answer: 'Our standard working hours are Monday to Saturday, 8am to 6pm. However, we understand that some projects may require flexible scheduling, and we can arrange work outside these hours when necessary.',
      },
    ],
  },
  {
    title: 'Electrical Services',
    icon: Zap,
    color: 'amber',
    faqs: [
      {
        question: 'Are your electricians qualified?',
        answer: 'All our electricians are fully qualified, NICEIC approved, and registered. They undergo regular training to stay up-to-date with the latest regulations and technologies.',
      },
      {
        question: 'Do you provide electrical certificates?',
        answer: 'Yes, we provide all necessary certification including Electrical Installation Certificates (EIC) and Electrical Installation Condition Reports (EICR). These are essential for insurance and property transactions.',
      },
      {
        question: 'Can you install EV chargers?',
        answer: 'Absolutely! We\'re experienced in installing electric vehicle charging points for homes and businesses. We can also help you apply for the OZEV grant which can cover part of the installation cost.',
      },
      {
        question: 'How often should I have my electrics checked?',
        answer: 'We recommend an EICR (Electrical Installation Condition Report) every 10 years for homeowners, and every 5 years for rental properties (which is a legal requirement). If your property is older or you\'re experiencing issues, more frequent checks may be advisable.',
      },
    ],
  },
  {
    title: 'Carpentry & Joinery',
    icon: Hammer,
    color: 'orange',
    faqs: [
      {
        question: 'Do you make bespoke furniture?',
        answer: 'Yes, we specialize in bespoke carpentry and can create custom furniture, fitted wardrobes, bookcases, and more. Everything is made to your exact specifications and designed to fit your space perfectly.',
      },
      {
        question: 'What types of wood do you work with?',
        answer: 'We work with a wide variety of materials including solid hardwoods (oak, walnut, ash), softwoods, MDF, plywood, and veneered boards. We can advise on the best material for your project and budget.',
      },
      {
        question: 'How long does a fitted wardrobe take to install?',
        answer: 'A typical fitted wardrobe installation takes 1-3 days depending on size and complexity. Manufacturing time is usually 2-4 weeks from design approval. We\'ll provide a detailed timeline during your consultation.',
      },
      {
        question: 'Do you repair existing woodwork?',
        answer: 'Yes, we offer repair services for doors, windows, skirting boards, staircases, and more. Often repairs can be more cost-effective than replacement while maintaining the character of your home.',
      },
    ],
  },
  {
    title: 'Home Renovations',
    icon: HomeIcon,
    color: 'blue',
    faqs: [
      {
        question: 'Do you handle planning permission?',
        answer: 'We can guide you through the planning process and work with architects and planning consultants. While we don\'t submit applications directly, we can recommend trusted professionals and ensure all work meets regulations.',
      },
      {
        question: 'Can you manage the entire renovation project?',
        answer: 'Yes, we offer full project management services. We coordinate all trades, manage timelines, and ensure quality control throughout your renovation. You\'ll have a single point of contact for the entire project.',
      },
      {
        question: 'How long does a typical kitchen renovation take?',
        answer: 'A full kitchen renovation typically takes 2-4 weeks depending on the scope of work. This includes removal of the old kitchen, any electrical and plumbing work, installation, and finishing. We\'ll provide a detailed schedule before starting.',
      },
      {
        question: 'Do you provide warranties on your work?',
        answer: 'Yes, all our work comes with a minimum 2-year warranty on workmanship. Many products and materials we install also come with manufacturer warranties which we\'ll explain during your consultation.',
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    icon: PoundSterling,
    color: 'green',
    faqs: [
      {
        question: 'How do you price your work?',
        answer: 'We provide detailed, itemized quotations after assessing your project. Our pricing is transparent with no hidden costs. For smaller jobs, we may provide fixed prices; for larger projects, we typically provide a detailed breakdown.',
      },
      {
        question: 'Do you require a deposit?',
        answer: 'For larger projects, we typically request a deposit of 20-30% to secure materials and your booking. The remaining balance is usually split into stage payments aligned with project milestones.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, debit/credit cards, and cash. For larger projects, we can discuss payment plans to spread the cost. All payments are clearly outlined in our quotations.',
      },
      {
        question: 'What happens if the project cost changes?',
        answer: 'Any changes to the agreed scope will be discussed with you first. We\'ll provide a written variation order detailing additional costs before proceeding. We aim to stick to our original quotations wherever possible.',
      },
    ],
  },
  {
    title: 'Safety & Compliance',
    icon: Shield,
    color: 'purple',
    faqs: [
      {
        question: 'Do you follow COVID-19 safety protocols?',
        answer: 'Yes, we maintain appropriate health and safety measures. Our team will respect your home and can wear masks, maintain ventilation, and follow any specific requirements you have.',
      },
      {
        question: 'How do you ensure work meets building regulations?',
        answer: 'All our work is carried out to current building regulations. For notifiable work, we\'ll arrange building control inspections. Our electrical work is self-certified through NICEIC.',
      },
      {
        question: 'What happens if something goes wrong after completion?',
        answer: 'We stand behind our work. If any issues arise within the warranty period, contact us and we\'ll arrange to inspect and rectify the problem at no additional cost. We aim to respond within 48 hours.',
      },
      {
        question: 'Do your workers have DBS checks?',
        answer: 'Yes, all our team members have undergone background checks. We understand the importance of trust when working in your home and take this responsibility seriously.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
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
            <span className="text-white font-medium">FAQs</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/70">
              Find answers to common questions about our services, processes, and policies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const colors = colorClasses[category.color];
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-navy-900">{category.title}</h2>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const key = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={key}
                        className={`bg-white rounded-xl border-2 ${
                          isOpen ? colors.border : 'border-slate-100'
                        } overflow-hidden transition-colors`}
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-semibold text-navy-900">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center"
        >
          <h3 className="font-heading text-2xl font-bold text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-white/80 mb-6">
            We're here to help. Get in touch with our team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gold-400 hover:text-navy-900 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/book"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
