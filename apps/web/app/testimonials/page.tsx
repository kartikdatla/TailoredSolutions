'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, Quote, ArrowRight, Users, Award, ThumbsUp, Heart } from 'lucide-react';

// Stats type
interface StatsData {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  starRating: number;
  referralRate: number;
}

const testimonials = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'Hampstead, London',
    project: 'Luxury Kitchen Renovation',
    rating: 5,
    text: 'Absolutely fantastic work on our kitchen renovation. From start to finish, the communication was excellent and the quality of work exceeded our expectations. The team was professional, tidy, and respectful of our home. Would highly recommend to anyone looking for premium home improvements.',
    date: '2024-01',
    featured: true,
  },
  {
    id: '2',
    name: 'James Thompson',
    location: 'Islington, London',
    project: 'Victorian House Rewire',
    rating: 5,
    text: 'Had our 1930s house completely rewired and couldn\'t be happier with the result. Professional, tidy, and efficient. The team explained everything clearly and kept us informed throughout. The care they took with our period features was impressive. Excellent value for money.',
    date: '2024-01',
    featured: true,
  },
  {
    id: '3',
    name: 'Emma & David Palmer',
    location: 'Richmond, London',
    project: 'Spa Bathroom Design',
    rating: 5,
    text: 'We\'re thrilled with our new bathroom! The attention to detail was impressive, and they went above and beyond to ensure we were happy. The Italian tiling work is absolutely beautiful and the underfloor heating is a dream. Thank you for transforming our space into a true sanctuary.',
    date: '2023-12',
    featured: true,
  },
  {
    id: '4',
    name: 'Michael Roberts',
    location: 'Chelsea, London',
    project: 'Bespoke Wardrobes',
    rating: 5,
    text: 'Brilliant bespoke wardrobes that perfectly fit our awkward alcoves. The design consultation was really helpful, with great suggestions we hadn\'t considered. The final result with the soft-close drawers and LED lighting is exactly what we wanted. Great craftsmanship and fair pricing.',
    date: '2023-12',
  },
  {
    id: '5',
    name: 'Lisa Kendall',
    location: 'St Albans, Hertfordshire',
    project: 'Tesla Charger Installation',
    rating: 5,
    text: 'Quick and professional installation of our home EV charger. Everything was explained clearly, all the paperwork and OZEV grant handled, and the installation was neat and tidy. The electrician was knowledgeable and gave us great advice on optimising our charging setup.',
    date: '2023-11',
  },
  {
    id: '6',
    name: 'Robert & Anne Wilson',
    location: 'Kensington, London',
    project: 'Executive Home Office',
    rating: 5,
    text: 'They built us the perfect home office with a stunning floating walnut desk and floor-to-ceiling shelving. The cable management solution is genius, and the acoustic panels have transformed my video calls. Tailored Solutions truly understand luxury finishes.',
    date: '2023-11',
  },
  {
    id: '7',
    name: 'Charlotte Bennett',
    location: 'Wimbledon, London',
    project: 'Smart Lighting System',
    rating: 5,
    text: 'Came to install a complete Lutron lighting system throughout our home and did an amazing job. Very professional, arrived on time, and left everything spotless. The new lighting has completely changed the atmosphere of our home. The app control is fantastic.',
    date: '2023-10',
  },
  {
    id: '8',
    name: 'Tom Harrison',
    location: 'Mayfair, London',
    project: 'Smart Home Integration',
    rating: 5,
    text: 'Comprehensive smart home installation including automated blinds, whole-house audio, and climate control. The team handled the complexity brilliantly and provided excellent training on all the systems. Everything works seamlessly together. Highly recommended.',
    date: '2023-10',
  },
];

export default function TestimonialsPage() {
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

  const averageRating = (
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  ).toFixed(1);

  const stats = [
    { icon: Star, value: statsData?.starRating?.toFixed(1) || averageRating, label: 'Average Rating', color: 'text-gold-500' },
    { icon: Users, value: `${statsData?.projectsCompleted || 500}+`, label: 'Happy Clients', color: 'text-primary-500' },
    { icon: ThumbsUp, value: `${statsData?.clientSatisfaction || 100}%`, label: 'Satisfaction', color: 'text-green-500' },
    { icon: Heart, value: `${statsData?.referralRate || 98}%`, label: 'Referral Rate', color: 'text-red-500' },
  ];

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
                <Star className="w-4 h-4 fill-gold-400" />
                Client Reviews
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              What Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Clients Say
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Don&apos;t just take our word for it. Here&apos;s what our clients
              have to say about working with Tailored Solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-16 z-10">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-luxury-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className={`w-6 h-6 ${stat.color} ${stat.icon === Star ? 'fill-gold-500' : ''}`} />
                  <span className="font-display text-4xl text-navy-900">{stat.value}</span>
                </div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-24">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label text-primary-600">Featured Reviews</span>
            <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-6">
              Stories from Our Clients
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {testimonials.filter(t => t.featured).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-3xl p-8 shadow-luxury border border-slate-100 hover:shadow-luxury-lg transition-all duration-500"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-lg">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-gold-500 fill-gold-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">{testimonial.text}</p>

                <div className="pt-6 border-t border-slate-100">
                  <p className="font-heading font-semibold text-navy-900">{testimonial.name}</p>
                  <p className="text-slate-500 text-sm">
                    {testimonial.project} • {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label text-primary-600">More Reviews</span>
            <h2 className="font-display text-4xl md:text-5xl text-navy-900 mb-6">
              Trusted by Homeowners
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.filter(t => !t.featured).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-luxury transition-all duration-500"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-gold-500 fill-gold-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{testimonial.text}</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-semibold text-navy-900 text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">
                    {testimonial.project} • {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
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
              <span className="section-label text-gold-400 mb-4">Join Our Clients</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                Ready to Experience the Difference?
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Join our growing list of satisfied clients. Book a free consultation
                and discover why we&apos;re the trusted choice for premium home improvements.
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
                  href="/portfolio"
                  className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-4 font-semibold"
                >
                  View Our Work
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
