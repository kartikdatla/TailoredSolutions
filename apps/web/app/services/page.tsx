'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Zap,
  Hammer,
  Home,
  Lightbulb,
  Plug,
  Cable,
  Car,
  Search,
  FileCheck,
  Wrench,
  DoorOpen,
  Layers,
  BookOpen,
  Bath,
  UtensilsCrossed,
  Paintbrush,
  Grid3X3,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Award,
  Phone,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

// Types for services data
interface ServiceItem {
  title: string;
  description: string;
}

interface ServiceCategory {
  title: string;
  description: string;
  badge: string;
  items: ServiceItem[];
}

interface ServicesData {
  electrical: ServiceCategory;
  carpentry: ServiceCategory;
  renovation: ServiceCategory;
}

// Icon mapping for service items (used as fallback icons)
const serviceIcons: Record<string, LucideIcon> = {
  // Electrical
  'Full & Partial Rewiring': Cable,
  'Consumer Unit Upgrades': Plug,
  'Lighting Design & Installation': Lightbulb,
  'EV Charger Installation': Car,
  'Fault Finding & Diagnostics': Search,
  'EICR Testing & Certification': FileCheck,
  'Socket & Switch Installation': Plug,
  'Electrical Inspections': FileCheck,
  // Carpentry
  'Bespoke Furniture': Wrench,
  'Kitchen Installation': UtensilsCrossed,
  'Door & Frame Installation': DoorOpen,
  'Premium Flooring': Layers,
  'Built-in Cabinetry': BookOpen,
  'Architectural Joinery': Grid3X3,
  'Fitted Wardrobes': BookOpen,
  'Kitchen Fitting': UtensilsCrossed,
  'Staircase Installation': Grid3X3,
  'Doors & Windows': DoorOpen,
  'Decking & Fencing': Layers,
  // Renovation
  'Luxury Bathroom Design': Bath,
  'Kitchen Remodeling': UtensilsCrossed,
  'Painting & Decorating': Paintbrush,
  'Premium Tiling': Grid3X3,
  'Property Maintenance': Wrench,
  'Complete Renovations': Sparkles,
  'Kitchen Renovations': UtensilsCrossed,
  'Bathroom Renovations': Bath,
  'Loft Conversions': Home,
  'Extensions': Home,
  'Garage Conversions': Home,
  'General Renovations': Sparkles,
};

// Default icon for services not in the mapping
const getServiceIcon = (name: string): LucideIcon => {
  return serviceIcons[name] || Wrench;
};

// Category configuration (styles)
const categoryConfig = {
  electrical: {
    id: 'electrical',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    lightGradient: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-500',
    accentBg: 'bg-amber-500',
  },
  carpentry: {
    id: 'carpentry',
    icon: Hammer,
    gradient: 'from-amber-600 to-amber-800',
    lightGradient: 'from-amber-50 to-yellow-50',
    accentColor: 'text-amber-700',
    accentBg: 'bg-amber-700',
  },
  renovation: {
    id: 'home-improvements',
    icon: Home,
    gradient: 'from-primary-500 to-primary-700',
    lightGradient: 'from-primary-50 to-blue-50',
    accentColor: 'text-primary-600',
    accentBg: 'bg-primary-600',
  },
};

const benefits = [
  {
    icon: Shield,
    title: 'Fully Accredited',
    description: 'NICEIC approved, Checkatrade verified, and fully insured for your peace of mind.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'We respect your time with punctual arrivals and projects completed on schedule.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'Comprehensive warranties on all work with dedicated aftercare support.',
  },
];

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/api/admin/content');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.services) {
            setServicesData(result.data.services);
          }
        }
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };
    loadServices();
  }, []);

  // Build service categories from data
  const serviceCategories = servicesData ? [
    {
      ...categoryConfig.electrical,
      title: servicesData.electrical?.title || 'Electrical Services',
      subtitle: servicesData.electrical?.badge || 'NICEIC APPROVED',
      description: servicesData.electrical?.description || '',
      services: (servicesData.electrical?.items || []).map(item => ({
        icon: getServiceIcon(item.title),
        name: item.title,
        description: item.description,
      })),
    },
    {
      ...categoryConfig.carpentry,
      title: servicesData.carpentry?.title || 'Carpentry & Joinery',
      subtitle: servicesData.carpentry?.badge || 'MASTER CRAFTSMEN',
      description: servicesData.carpentry?.description || '',
      services: (servicesData.carpentry?.items || []).map(item => ({
        icon: getServiceIcon(item.title),
        name: item.title,
        description: item.description,
      })),
    },
    {
      ...categoryConfig.renovation,
      title: servicesData.renovation?.title || 'Home Improvements',
      subtitle: servicesData.renovation?.badge || 'FULL PROJECT MANAGEMENT',
      description: servicesData.renovation?.description || '',
      services: (servicesData.renovation?.items || []).map(item => ({
        icon: getServiceIcon(item.title),
        name: item.title,
        description: item.description,
      })),
    },
  ] : [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900">
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full" />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>

        <div className="relative container-luxury py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm font-medium mb-6 border border-white/10">
                <Sparkles className="w-4 h-4" />
                Premium Home Services
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              Exceptional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Craftsmanship
              </span>
              <br />for Your Home
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed"
            >
              Professional electrical, carpentry, and home improvement services
              delivered with precision, expertise, and an unwavering commitment to excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/book"
                className="btn bg-white text-navy-900 hover:bg-gold-400 px-8 py-4 font-semibold group"
              >
                <span>Get Free Quote</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:+441234567890"
                className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-4 font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>01234 567890</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gold-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Service Categories */}
      {serviceCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`relative py-24 overflow-hidden ${
            categoryIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'
          }`}
        >
          {/* Background Accent */}
          <div className={`absolute inset-y-0 ${categoryIndex % 2 === 0 ? 'left-0' : 'right-0'} w-1/3 bg-gradient-to-r ${category.lightGradient} opacity-50`} />

          <div className="relative container-luxury">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row lg:items-end gap-6 mb-16"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${category.accentBg} text-white`}>
                    {category.subtitle}
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-4">
                  {category.title}
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
              <Link
                href="/book"
                className={`btn ${category.accentBg} text-white hover:opacity-90 px-6 py-3 font-semibold group self-start lg:self-auto`}
              >
                <span>Get Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Service Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-luxury transition-all duration-500"
                >
                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />

                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.lightGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`w-7 h-7 ${category.accentColor}`} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className={`w-5 h-5 ${category.accentColor}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Us Section */}
      <section className="relative py-24 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label text-gold-400 mb-4">Why Choose Us</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              The Tailored Solutions Difference
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We combine traditional craftsmanship with modern techniques to deliver
              exceptional results on every project.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center group hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center mx-auto mb-6 shadow-glow-gold group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-navy-900" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50 to-transparent" />
        </div>

        <div className="relative container-luxury">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-primary-600 mb-4">Get Started</span>
              <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-6">
                Ready to Transform Your Home?
              </h2>
              <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Book a free consultation with our experts. We&apos;ll discuss your project,
                provide professional advice, and deliver a detailed quote with no obligation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/book"
                  className="btn btn-primary btn-lg group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/portfolio"
                  className="btn btn-outline btn-lg"
                >
                  View Our Work
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free Quotes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Expert Advice</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Same-Day Response</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
