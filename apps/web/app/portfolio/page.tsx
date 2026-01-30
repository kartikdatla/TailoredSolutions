'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Eye,
  Sparkles,
  Zap,
  Hammer,
  Home,
  Star,
  Filter,
} from 'lucide-react';

// Stats type
interface StatsData {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  starRating: number;
  referralRate: number;
}

// Portfolio data
const portfolioItems = [
  {
    id: '1',
    title: 'Luxury Kitchen Transformation',
    category: 'home-improvement',
    description: 'A stunning full kitchen remodel featuring custom Shaker-style cabinetry, quartz countertops, integrated appliances, and bespoke lighting design. The project transformed a dated 1980s kitchen into a modern culinary haven.',
    images: ['/images/portfolio/kitchen-1.jpg'],
    location: 'Hampstead, London',
    duration: '4 weeks',
    year: '2024',
    highlights: ['Custom cabinetry', 'Quartz worktops', 'Smart appliances', 'Underfloor heating'],
  },
  {
    id: '2',
    title: 'Victorian House Rewiring',
    category: 'electrical',
    description: 'Complete electrical rewire of a Grade II listed Victorian property, preserving period features while bringing the system up to modern standards. Includes a new 18-way consumer unit and smart home integration.',
    images: ['/images/portfolio/electrical-1.jpg'],
    location: 'Islington, London',
    duration: '2 weeks',
    year: '2024',
    highlights: ['Period-sensitive', '18-way consumer unit', 'Smart lighting', 'EICR certified'],
  },
  {
    id: '3',
    title: 'Bespoke Fitted Wardrobes',
    category: 'carpentry',
    description: 'Floor-to-ceiling fitted wardrobes with push-to-open doors, internal LED lighting, and a clever internal configuration system. Maximizes storage in an awkward alcove space.',
    images: ['/images/portfolio/carpentry-1.jpg'],
    location: 'Chelsea, London',
    duration: '8 days',
    year: '2024',
    highlights: ['Push-to-open', 'LED lighting', 'Soft-close', 'Oak veneer'],
  },
  {
    id: '4',
    title: 'Spa-Style Bathroom',
    category: 'home-improvement',
    description: 'Complete bathroom renovation featuring a walk-in rainfall shower, freestanding bath, heated towel rails, and imported Italian porcelain tiles. A true sanctuary for relaxation.',
    images: ['/images/portfolio/bathroom-1.jpg'],
    location: 'Richmond, London',
    duration: '3 weeks',
    year: '2024',
    highlights: ['Rainfall shower', 'Underfloor heating', 'Italian tiles', 'Freestanding bath'],
  },
  {
    id: '5',
    title: 'Tesla Wall Connector',
    category: 'electrical',
    description: 'Professional installation of a Tesla Wall Connector with dedicated 32A circuit, weatherproof enclosure, and smart energy monitoring. Includes OZEV grant application assistance.',
    images: ['/images/portfolio/ev-charger-1.jpg'],
    location: 'St Albans, Herts',
    duration: '1 day',
    year: '2024',
    highlights: ['Tesla certified', '32A dedicated circuit', 'Smart monitoring', 'OZEV approved'],
  },
  {
    id: '6',
    title: 'Executive Home Office',
    category: 'carpentry',
    description: 'A bespoke home office designed for a city executive, featuring a floating walnut desk, floor-to-ceiling library shelving, integrated cable management, and acoustic paneling.',
    images: ['/images/portfolio/office-1.jpg'],
    location: 'Kensington, London',
    duration: '2 weeks',
    year: '2024',
    highlights: ['Walnut desk', 'Library shelving', 'Cable management', 'Acoustic panels'],
  },
  {
    id: '7',
    title: 'Smart Home Integration',
    category: 'electrical',
    description: 'Complete smart home installation including automated lighting, motorized blinds, whole-house audio, and a centralized control system. Control everything from your phone or voice.',
    images: ['/images/portfolio/smart-home-1.jpg'],
    location: 'Mayfair, London',
    duration: '1 week',
    year: '2024',
    highlights: ['Lutron lighting', 'Sonos audio', 'Automated blinds', 'Control4 system'],
  },
  {
    id: '8',
    title: 'Oak Staircase Renovation',
    category: 'carpentry',
    description: 'Replacement of a tired carpet staircase with solid oak treads, glass balustrade, and LED strip lighting. Transformed the entrance hallway into a stunning focal point.',
    images: ['/images/portfolio/staircase-1.jpg'],
    location: 'Wimbledon, London',
    duration: '5 days',
    year: '2024',
    highlights: ['Solid oak', 'Glass balustrade', 'LED lighting', 'Bespoke newel posts'],
  },
];

const categories = [
  { id: 'all', label: 'All Projects', icon: Sparkles },
  { id: 'electrical', label: 'Electrical', icon: Zap },
  { id: 'carpentry', label: 'Carpentry', icon: Hammer },
  { id: 'home-improvement', label: 'Renovations', icon: Home },
];

const categoryColors = {
  'electrical': {
    bg: 'bg-amber-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  'carpentry': {
    bg: 'bg-amber-700',
    light: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  'home-improvement': {
    bg: 'bg-primary-600',
    light: 'bg-primary-50',
    text: 'text-primary-600',
    border: 'border-primary-200',
  },
};

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[0] | null>(null);

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

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

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

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
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
                <Eye className="w-4 h-4" />
                Our Work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Projects
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Explore our portfolio of completed projects. Each one represents our commitment
              to quality craftsmanship and attention to detail.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-12"
          >
            {[
              { value: `${statsData?.projectsCompleted || 500}+`, label: 'Projects Completed' },
              { value: `${statsData?.clientSatisfaction || 98}%`, label: 'Client Satisfaction' },
              { value: `${statsData?.yearsExperience || 15}+`, label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl text-gold-400 mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="container-luxury">
          <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 text-slate-500 pr-4 border-r border-slate-200">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-navy-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
            <div className="ml-auto text-sm text-slate-500">
              {filteredItems.length} project{filteredItems.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-luxury">
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const colors = categoryColors[item.category as keyof typeof categoryColors];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(item)}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury-lg transition-all duration-500 border border-slate-100">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                              {item.category === 'electrical' && <Zap className="w-8 h-8 text-white" />}
                              {item.category === 'carpentry' && <Hammer className="w-8 h-8 text-white" />}
                              {item.category === 'home-improvement' && <Home className="w-8 h-8 text-white" />}
                            </div>
                            <span className="text-slate-400 text-sm">Project Image</span>
                          </div>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full text-navy-900 font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <Eye className="w-4 h-4" />
                            View Project
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${colors.bg} text-white`}>
                          {item.category.replace('-', ' ')}
                        </div>

                        {/* Year Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700">
                          {item.year}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects found</h3>
              <p className="text-slate-500">Try selecting a different category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
                >
                  <X className="w-6 h-6 text-slate-700" />
                </button>

                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-2xl ${categoryColors[selectedProject.category as keyof typeof categoryColors].bg} flex items-center justify-center mx-auto mb-4`}>
                      {selectedProject.category === 'electrical' && <Zap className="w-10 h-10 text-white" />}
                      {selectedProject.category === 'carpentry' && <Hammer className="w-10 h-10 text-white" />}
                      {selectedProject.category === 'home-improvement' && <Home className="w-10 h-10 text-white" />}
                    </div>
                    <span className="text-slate-400">Project Gallery</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${categoryColors[selectedProject.category as keyof typeof categoryColors].bg} text-white`}>
                    {selectedProject.category.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-slate-500">{selectedProject.year}</span>
                </div>

                <h2 className="font-display text-3xl text-navy-900 mb-4">{selectedProject.title}</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">{selectedProject.description}</p>

                {/* Details */}
                <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span>{selectedProject.duration}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="font-heading font-semibold text-navy-900 mb-4">Project Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm"
                      >
                        <Star className="w-3.5 h-3.5 text-gold-500" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/book"
                    className="btn btn-primary btn-lg group flex-1 justify-center"
                    onClick={() => setSelectedProject(null)}
                  >
                    <span>Start Similar Project</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn btn-outline btn-lg flex-1 justify-center"
                    onClick={() => setSelectedProject(null)}
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="section-label text-gold-400 mb-4">Ready to Start?</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                Inspired by Our Work?
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Let&apos;s discuss your project. Book a free consultation and we&apos;ll
                provide expert advice and a detailed quote tailored to your vision.
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
                  href="/services"
                  className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-4 font-semibold"
                >
                  View All Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
