'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Award,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Sparkles,
  Target,
  Lightbulb,
} from 'lucide-react';

// Stats type
interface StatsData {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  starRating: number;
  referralRate: number;
}

const values = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Every project receives our full attention and commitment to excellence. We take pride in delivering work that exceeds expectations.',
  },
  {
    icon: Shield,
    title: 'Trust & Reliability',
    description: 'Fully insured and accredited, we stand behind our work with comprehensive warranties and professional guarantees.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We listen, advise, and work closely with you throughout every project.',
  },
  {
    icon: Clock,
    title: 'On Time, On Budget',
    description: 'We respect your time and money. Clear timelines, transparent pricing, and no hidden surprises.',
  },
];

// Credentials will have dynamic years value
const getCredentials = (years: number) => [
  'NICEIC approved contractor',
  'City & Guilds qualified carpenter',
  'Part P registered for electrical work',
  'Fully insured (Public Liability £5M)',
  'DBS checked for your peace of mind',
  `${years}+ years of industry experience`,
  'Checkatrade verified member',
  'Trading Standards approved',
];

// Stats generator function
const getStats = (data: StatsData | null) => [
  { value: `${data?.yearsExperience || 15}+`, label: 'Years Experience' },
  { value: `${data?.projectsCompleted || 500}+`, label: 'Projects Completed' },
  { value: `${data?.clientSatisfaction || 98}%`, label: 'Client Satisfaction' },
  { value: `${data?.starRating?.toFixed(1) || '5.0'}`, label: 'Star Rating' },
];

export default function AboutPage() {
  // Load stats from site content
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/content');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.stats) {
            setStatsData(result.data.stats);
          }
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  const stats = getStats(statsData);
  const credentials = getCredentials(statsData?.yearsExperience || 15);
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="relative container-luxury py-28">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm font-medium mb-6 border border-white/10">
                <Users className="w-4 h-4" />
                About Tailored Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              Craftsmanship{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Meets Passion
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Professional trades with a personal touch. Quality workmanship
              you can trust for all your home improvement needs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-luxury-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-primary-600 mb-2">{stat.value}</div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-primary-600">Our Story</span>
              <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-8">
                Built on Trust, Driven by Excellence
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  With over {statsData?.yearsExperience || 15} years of experience in the trades, I started Tailored Solutions
                  with a simple mission: to provide homeowners with
                  reliable, high-quality services they can trust.
                </p>
                <p>
                  Having trained as both an electrician and carpenter, I offer a
                  unique combination of skills that allows me to handle complete
                  home improvement projects from start to finish. This means
                  better coordination, faster completion times, and consistent
                  quality throughout.
                </p>
                <p>
                  I believe in doing things right the first time, using quality
                  materials, and treating every home as if it were my own. My
                  reputation has been built on recommendations from satisfied
                  customers, and I&apos;m proud to say that most of my work comes
                  from referrals and repeat clients.
                </p>
              </div>

              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 mt-8 text-primary-600 font-semibold hover:gap-3 transition-all group"
              >
                See our work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-50 to-gold-50 rounded-3xl p-10 lg:p-14">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gold-400/20 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary-400/20 rounded-full blur-xl" />

                <div className="relative text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="font-display text-5xl font-bold text-white">{statsData?.yearsExperience || 15}+</span>
                  </div>
                  <h3 className="font-display text-2xl text-navy-900 mb-4">
                    Years of Experience
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <p className="text-slate-600">{statsData?.starRating?.toFixed(1) || '5.0'}-Star Rated Service</p>

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="font-display text-2xl text-primary-600">{statsData?.projectsCompleted || 500}+</div>
                        <div className="text-sm text-slate-500">Projects</div>
                      </div>
                      <div>
                        <div className="font-display text-2xl text-primary-600">{statsData?.referralRate || 98}%</div>
                        <div className="text-sm text-slate-500">Referral Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label text-primary-600">Our Values</span>
            <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-6">
              What We Stand For
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              These principles guide everything we do and ensure you receive
              the best possible service.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-luxury border border-slate-100 group hover:shadow-luxury-lg transition-all duration-500"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-24">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-primary-600">Qualifications</span>
              <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-6">
                Professionally Qualified & Fully Insured
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Peace of mind comes from knowing you&apos;re working with a qualified
                professional. All our work is carried out to the highest standards
                and fully complies with current building regulations.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We hold comprehensive public liability insurance and all
                electrical work is certified and registered with the relevant
                bodies. You can trust that your home is in safe hands.
              </p>
              <Link href="/portfolio" className="btn btn-primary btn-lg group">
                <span>View Our Work</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-10 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-navy-900" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold">
                    Qualifications & Credentials
                  </h3>
                </div>
                <ul className="space-y-4">
                  {credentials.map((credential, index) => (
                    <motion.li
                      key={credential}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                      <span className="text-slate-300">{credential}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-gold-400 mb-4">Let&apos;s Work Together</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                Ready to Transform Your Home?
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Let&apos;s discuss your project. Book a free consultation and
                experience the difference quality craftsmanship makes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/book"
                  className="btn bg-white text-navy-900 hover:bg-gold-400 px-8 py-4 font-semibold group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-4 font-semibold"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
