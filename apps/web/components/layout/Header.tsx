'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, ArrowRight, Settings } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/services',
    label: 'Services',
    submenu: [
      { href: '/services#electrical', label: 'Electrical Services' },
      { href: '/services#carpentry', label: 'Carpentry' },
      { href: '/services#home-improvements', label: 'Home Improvements' },
    ],
  },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-elegant py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-br from-primary-600 to-primary-700'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span
                className={`font-display text-2xl font-bold transition-colors ${
                  isScrolled ? 'text-white' : 'text-white'
                }`}
              >
                TS
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/0 via-gold-400/30 to-gold-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </div>
            <div className="hidden sm:block">
              <span
                className={`font-heading font-bold text-xl tracking-tight transition-colors ${
                  isScrolled ? 'text-navy-900' : 'text-white'
                }`}
              >
                Tailored
              </span>
              <span
                className={`font-heading font-bold text-xl tracking-tight transition-colors ${
                  isScrolled ? 'text-primary-600' : 'text-gold-400'
                }`}
              >
                Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-all duration-300 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-primary-600 hover:bg-primary-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeSubmenu === link.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {link.submenu && activeSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-luxury-lg border border-slate-100 overflow-hidden"
                    >
                      <div className="py-2">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className="block px-4 py-3 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+441234567890"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-primary-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isScrolled ? 'bg-primary-100' : 'bg-white/10'
                }`}
              >
                <Phone
                  className={`w-4 h-4 ${isScrolled ? 'text-primary-600' : 'text-white'}`}
                />
              </div>
              <span className="hidden xl:inline">01234 567890</span>
            </a>
            <Link
              href="/book"
              className={`btn btn-md group ${
                isScrolled
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white text-navy-900 hover:bg-gold-400 hover:text-navy-900'
              }`}
            >
              <span>Get Quote</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {/* Admin Login Button */}
            <Link
              href="/admin/login"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isScrolled
                  ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
              title="Admin Login"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              isScrolled
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-luxury-lg"
          >
            <nav className="container-luxury py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                    onClick={() => {
                      if (!link.submenu) setIsMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <div className="pl-4 mt-1 mb-2 space-y-1">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className="block px-4 py-2 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="divider-gradient my-4" />

              <a
                href="tel:+441234567890"
                className="flex items-center gap-3 px-4 py-3 text-slate-700"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    Call us
                  </div>
                  <div className="font-semibold">01234 567890</div>
                </div>
              </a>

              <Link
                href="/book"
                className="btn btn-primary btn-lg mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Get Free Quote</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Admin Login Link */}
              <Link
                href="/admin/login"
                className="flex items-center gap-3 px-4 py-3 mt-4 text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Admin
                  </div>
                  <div className="font-medium text-sm">Login to Dashboard</div>
                </div>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
