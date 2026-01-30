'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Clock, Shield, Award } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Electrical Services', href: '/services#electrical' },
    { label: 'Carpentry & Joinery', href: '/services#carpentry' },
    { label: 'Home Improvements', href: '/services#home-improvements' },
    { label: 'Emergency Repairs', href: '/services#emergency' },
    { label: 'Consultations', href: '/book' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Portfolio', href: '/portfolio' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'Book Consultation', href: '/book' },
    { label: 'Client Portal', href: '/portal' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const accreditations = [
  { label: 'NICEIC Approved', icon: Shield },
  { label: 'Checkatrade Verified', icon: Award },
  { label: 'Trading Standards', icon: Award },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="container-luxury py-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-gold-500/10 rounded-full text-gold-400 text-sm font-medium mb-4">
              Stay Updated
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-white mb-4">
              Get Expert Tips & Exclusive Offers
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for home improvement insights, maintenance tips, and special promotions.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                className="btn bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center overflow-hidden">
                <span className="font-display text-2xl font-bold text-white">TS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400/0 via-gold-400/30 to-gold-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-white">Tailored</span>
                <span className="font-heading font-bold text-xl text-gold-400">Solutions</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Premium electrician, carpentry, and home improvement services. We bring expertise, quality craftsmanship, and attention to detail to every project.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="tel:+441234567890"
                className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center group-hover:bg-primary-600/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Call Us</div>
                  <div className="font-medium">01234 567890</div>
                </div>
              </a>
              <a
                href="mailto:info@tailoredsolutions.co.uk"
                className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center group-hover:bg-primary-600/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Email Us</div>
                  <div className="font-medium">info@tailoredsolutions.co.uk</div>
                </div>
              </a>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Service Area</div>
                  <div className="font-medium">Greater London & Surrounding</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Working Hours</div>
                  <div className="font-medium">Mon - Sat: 8AM - 6PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-gold-400 to-transparent"></span>
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white hover:pl-2 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-gold-400 to-transparent"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white hover:pl-2 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-gold-400 to-transparent"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white hover:pl-2 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accreditations */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-gold-400 to-transparent"></span>
              Accredited
            </h4>
            <div className="space-y-4">
              {accreditations.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container-luxury py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Tailored Solutions. All rights reserved.</p>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 mr-2">Follow us:</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
