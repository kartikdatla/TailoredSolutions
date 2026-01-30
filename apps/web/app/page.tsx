'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Zap,
  Hammer,
  Home,
  Phone,
  ArrowRight,
  Star,
  CheckCircle,
  Award,
  Shield,
  Clock,
  Sparkles,
  Quote,
} from 'lucide-react';

// Stats type from site content
interface StatsData {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  starRating: number;
  referralRate: number;
}

const services = [
  {
    icon: Zap,
    title: 'Electrical',
    subtitle: 'Expert Solutions',
    description:
      'Complete electrical services from rewiring and fuse box upgrades to smart home installations and EV chargers.',
    features: ['Rewiring & Upgrades', 'Lighting Design', 'EV Charging Points', 'Safety Testing'],
    href: '/services#electrical',
  },
  {
    icon: Hammer,
    title: 'Carpentry',
    subtitle: 'Bespoke Craftsmanship',
    description:
      'Custom furniture, fitted kitchens, handcrafted built-ins, and precision joinery for discerning homeowners.',
    features: ['Custom Furniture', 'Kitchen Fitting', 'Built-in Storage', 'Flooring'],
    href: '/services#carpentry',
  },
  {
    icon: Home,
    title: 'Renovations',
    subtitle: 'Complete Transformations',
    description:
      'Full-scale home improvements from bathroom renovations to complete property transformations.',
    features: ['Bathroom Design', 'Kitchen Remodels', 'Extensions', 'Full Renovations'],
    href: '/services#home-improvements',
  },
];

// Stats will be loaded from site content - these are fallbacks
const getStats = (data: StatsData | null) => [
  { value: `${data?.yearsExperience || 15}+`, label: 'Years Experience', icon: Clock },
  { value: `${data?.projectsCompleted || 500}+`, label: 'Projects Completed', icon: Award },
  { value: `${data?.starRating?.toFixed(1) || '5.0'}`, label: 'Star Rating', icon: Star },
  { value: `${data?.clientSatisfaction || 100}%`, label: 'Client Satisfaction', icon: Shield },
];

const testimonials = [
  {
    quote: "The attention to detail was exceptional. Our kitchen renovation exceeded all expectations.",
    author: 'Sarah M.',
    role: 'Homeowner, Chelsea',
    rating: 5,
  },
  {
    quote: "Professional, punctual, and the quality of work is outstanding. Highly recommended.",
    author: 'James T.',
    role: 'Property Developer',
    rating: 5,
  },
  {
    quote: "They transformed our dated bathroom into a luxury spa retreat. Absolutely thrilled!",
    author: 'Emma P.',
    role: 'Homeowner, Hampstead',
    rating: 5,
  },
];

const features = [
  { text: 'Free Consultation', icon: Sparkles },
  { text: 'Fully Insured', icon: Shield },
  { text: 'Quality Guaranteed', icon: Award },
  { text: 'Transparent Pricing', icon: CheckCircle },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

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

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-navy-950 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950" />

          {/* Decorative Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating Orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container-luxury relative z-10 pt-32 pb-20"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-white/80 font-medium">
                  Premium Home Services
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
                Crafting
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-gold-400">
                  Exceptional
                </span>
                Living Spaces
              </h1>

              <p className="text-lg lg:text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
                Expert electrical, carpentry, and renovation services delivered
                with precision and care. Transform your home with London&apos;s
                trusted craftsmen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/book"
                  className="btn btn-lg bg-white text-navy-900 hover:bg-gold-400 group"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/portfolio"
                  className="btn btn-lg btn-outline-white"
                >
                  View Our Work
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2 text-white/70"
                  >
                    <feature.icon className="w-4 h-4 text-gold-400" />
                    <span className="text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`
                      p-8 rounded-2xl backdrop-blur-sm border border-white/10
                      ${i === 0 ? 'bg-white/10' : 'bg-white/5'}
                      hover:bg-white/10 transition-colors duration-300
                    `}
                  >
                    <stat.icon className={`w-6 h-6 mb-4 ${i === 0 ? 'text-gold-400' : 'text-primary-400'}`} />
                    <div className="text-4xl font-heading font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container-luxury">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 lg:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Our Expertise</span>
              <h2 className="section-title">
                Comprehensive Services for
                <span className="text-primary-600"> Every Need</span>
              </h2>
              <p className="section-subtitle">
                From intricate electrical work to bespoke carpentry and complete
                home transformations, we deliver excellence at every level.
              </p>
            </motion.div>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={service.href} className="block group h-full">
                  <div className="card-luxury h-full hover:shadow-luxury-xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                        <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="text-sm text-primary-600 font-medium mb-1">
                      {service.subtitle}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-navy-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2 text-sm text-slate-500"
                          >
                            <CheckCircle className="w-4 h-4 text-primary-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Why Us Section */}
      <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent" />

        <div className="container-luxury relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-navy-900 to-primary-900 rounded-3xl overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Award className="w-12 h-12 text-gold-400" />
                    </div>
                    <div className="text-6xl font-heading font-bold text-white mb-2">
                      {statsData?.yearsExperience || 15}+
                    </div>
                    <div className="text-white/60 text-lg">
                      Years of Excellence
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-luxury-xl p-6 max-w-xs"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-slate-700 font-medium">
                  &quot;Exceptional quality and service. Couldn&apos;t be happier!&quot;
                </p>
                <p className="text-slate-500 text-sm mt-2">— Verified Customer</p>
              </motion.div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">
                Trusted by Homeowners
                <span className="text-primary-600"> Across London</span>
              </h2>
              <p className="section-subtitle mb-10">
                With over {statsData?.yearsExperience || 15} years of experience, we&apos;ve built our reputation on
                quality craftsmanship, transparent communication, and unwavering
                commitment to client satisfaction.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Premium Quality',
                    desc: 'We use only the finest materials and techniques to ensure lasting results.',
                  },
                  {
                    title: 'Transparent Pricing',
                    desc: 'Detailed quotes with no hidden fees. Know exactly what you\'re paying for.',
                  },
                  {
                    title: 'Fully Guaranteed',
                    desc: 'All work backed by comprehensive warranties for your peace of mind.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-navy-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/about" className="btn btn-primary btn-lg">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-luxury">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Testimonials</span>
              <h2 className="section-title">
                What Our Clients
                <span className="text-primary-600"> Say</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover-lift"
              >
                <Quote className="w-10 h-10 text-primary-200 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <div className="font-semibold text-navy-900">{testimonial.author}</div>
                  <div className="text-slate-500 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials" className="btn btn-outline btn-lg">
              Read More Reviews
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-navy-950 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="container-luxury relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-white/80">Start Your Project Today</span>
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                Ready to Transform
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">
                  Your Home?
                </span>
              </h2>

              <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                Get in touch today for a free, no-obligation consultation. Let&apos;s
                discuss your vision and bring it to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book" className="btn btn-lg bg-white text-navy-900 hover:bg-gold-400 group">
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+441234567890"
                  className="btn btn-lg btn-outline-white"
                >
                  <Phone className="w-5 h-5" />
                  <span>01234 567890</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
