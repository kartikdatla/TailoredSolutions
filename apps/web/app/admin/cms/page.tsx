'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Save,
  Settings,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  Check,
  Loader2,
  Upload,
  Building2,
  Users,
  Zap,
  Hammer,
  Wrench,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Calendar,
  LogOut,
  Lock,
} from 'lucide-react';

// Types
interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: {
    street: string;
    city: string;
    areas: string[];
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    google: string;
  };
}

interface Stats {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  starRating: number;
  referralRate: number;
}

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

interface Services {
  electrical: ServiceCategory;
  carpentry: ServiceCategory;
  renovation: ServiceCategory;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  date: string;
  featured: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  year: string;
  images: string[];
  featured: boolean;
}

interface SiteContent {
  business: BusinessInfo;
  stats: Stats;
  services: Services;
  testimonials: Testimonial[];
  portfolio: PortfolioItem[];
}

type TabType = 'business' | 'stats' | 'services' | 'testimonials' | 'portfolio' | 'settings';

// Settings Tab Component
function SettingsTab({ adminEmail }: { adminEmail: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState(adminEmail);
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An error occurred' });
    }

    setIsChangingPassword(false);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage({ type: '', text: '' });

    if (!newEmail || !emailPassword) {
      setEmailMessage({ type: 'error', text: 'Email and password are required' });
      return;
    }

    setIsChangingEmail(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-email',
          email: newEmail,
          password: emailPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailMessage({ type: 'success', text: 'Email changed successfully!' });
        setEmailPassword('');
      } else {
        setEmailMessage({ type: 'error', text: data.error || 'Failed to change email' });
      }
    } catch {
      setEmailMessage({ type: 'error', text: 'An error occurred' });
    }

    setIsChangingEmail(false);
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h3 className="font-heading text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600" />
          Change Password
        </h3>

        {passwordMessage.text && (
          <div
            className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
              passwordMessage.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            {passwordMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <span className="text-sm">{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Change Email */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h3 className="font-heading text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary-600" />
          Change Email Address
        </h3>

        {emailMessage.text && (
          <div
            className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
              emailMessage.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            {emailMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <span className="text-sm">{emailMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm with Current Password
            </label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Enter your current password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isChangingEmail}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {isChangingEmail ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Change Email
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default function CMSPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('business');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contact: true,
    hours: true,
    social: false,
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();

      if (!data.authenticated) {
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      setAdminEmail(data.email || '');
      loadContent();
    } catch {
      router.push('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const result = await response.json();
        // API returns { success: true, data: content }
        if (result.success && result.data) {
          setContent(result.data);
        } else {
          // Load from default if API response is invalid
          const defaultContent = await import('@/data/site-content.json');
          setContent(defaultContent.default as unknown as SiteContent);
        }
      } else {
        // Load from default
        const defaultContent = await import('@/data/site-content.json');
        setContent(defaultContent.default as unknown as SiteContent);
      }
    } catch {
      // Load from default if fetch fails
      try {
        const defaultContent = await import('@/data/site-content.json');
        setContent(defaultContent.default as unknown as SiteContent);
      } catch {
        console.error('Failed to load content');
      }
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
    setIsSaving(false);
  };

  const updateBusiness = (field: string, value: string | object) => {
    if (!content) return;
    setContent({
      ...content,
      business: {
        ...content.business,
        [field]: value,
      },
    });
  };

  const updateStats = (field: keyof Stats, value: number) => {
    if (!content) return;
    setContent({
      ...content,
      stats: {
        ...content.stats,
        [field]: value,
      },
    });
  };

  const updateTestimonial = (id: string, field: string, value: string | number | boolean) => {
    if (!content) return;
    setContent({
      ...content,
      testimonials: content.testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    });
  };

  const addTestimonial = () => {
    if (!content) return;
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: 'New Client',
      location: 'London',
      service: 'electrical',
      rating: 5,
      text: 'Enter testimonial text here...',
      date: new Date().toISOString().split('T')[0],
      featured: false,
    };
    setContent({
      ...content,
      testimonials: [...content.testimonials, newTestimonial],
    });
  };

  const deleteTestimonial = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      testimonials: content.testimonials.filter((t) => t.id !== id),
    });
  };

  const updatePortfolioItem = (id: string, field: string, value: string | boolean | string[]) => {
    if (!content) return;
    setContent({
      ...content,
      portfolio: content.portfolio.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const addPortfolioItem = () => {
    if (!content) return;
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: 'New Project',
      category: 'electrical',
      description: 'Enter project description here...',
      location: 'London',
      year: new Date().getFullYear().toString(),
      images: [],
      featured: false,
    };
    setContent({
      ...content,
      portfolio: [...content.portfolio, newItem],
    });
  };

  const deletePortfolioItem = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      portfolio: content.portfolio.filter((p) => p.id !== id),
    });
  };

  const updateServiceCategory = (
    categoryKey: keyof Services,
    field: 'title' | 'description' | 'badge',
    value: string
  ) => {
    if (!content) return;
    setContent({
      ...content,
      services: {
        ...content.services,
        [categoryKey]: {
          ...content.services[categoryKey],
          [field]: value,
        },
      },
    });
  };

  const updateServiceItem = (
    categoryKey: keyof Services,
    itemIndex: number,
    field: 'title' | 'description',
    value: string
  ) => {
    if (!content) return;
    const newItems = [...content.services[categoryKey].items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    setContent({
      ...content,
      services: {
        ...content.services,
        [categoryKey]: {
          ...content.services[categoryKey],
          items: newItems,
        },
      },
    });
  };

  const addServiceItem = (categoryKey: keyof Services) => {
    if (!content) return;
    setContent({
      ...content,
      services: {
        ...content.services,
        [categoryKey]: {
          ...content.services[categoryKey],
          items: [
            ...content.services[categoryKey].items,
            { title: 'New Service', description: 'Enter service description here...' },
          ],
        },
      },
    });
  };

  const deleteServiceItem = (categoryKey: keyof Services, itemIndex: number) => {
    if (!content) return;
    const newItems = content.services[categoryKey].items.filter((_, i) => i !== itemIndex);
    setContent({
      ...content,
      services: {
        ...content.services,
        [categoryKey]: {
          ...content.services[categoryKey],
          items: newItems,
        },
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const tabs = [
    { id: 'business' as TabType, label: 'Business Info', icon: Building2 },
    { id: 'stats' as TabType, label: 'Statistics', icon: Star },
    { id: 'services' as TabType, label: 'Services', icon: Wrench },
    { id: 'testimonials' as TabType, label: 'Testimonials', icon: MessageSquare },
    { id: 'portfolio' as TabType, label: 'Portfolio', icon: Briefcase },
    { id: 'settings' as TabType, label: 'Account', icon: Settings },
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white/60">Admin</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white font-medium">Content Management</span>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">
                Content Management
              </h1>
              <p className="text-white/70 text-lg">
                Edit your website content, images, and settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              {adminEmail && (
                <span className="text-white/60 text-sm hidden md:block">
                  {adminEmail}
                </span>
              )}
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
              >
                <Eye className="w-4 h-4" />
                Preview Site
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-xl transition-all border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/calendar" className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-navy-900">Calendar</div>
                <div className="text-sm text-slate-500">Manage bookings</div>
              </div>
            </div>
          </Link>

          <Link href="/admin/consultations" className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-navy-900">Consultations</div>
                <div className="text-sm text-slate-500">View documents</div>
              </div>
            </div>
          </Link>

          <Link href="/admin/test-transcription" className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-navy-900">WhisperAI Demo</div>
                <div className="text-sm text-slate-500">Test transcription</div>
              </div>
            </div>
          </Link>

          <button
            onClick={loadContent}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-navy-900">Refresh</div>
                <div className="text-sm text-slate-500">Reload content</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sticky top-24">
              <h3 className="font-semibold text-navy-900 mb-4 px-2">Sections</h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Business Info Tab */}
              {activeTab === 'business' && content && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h3 className="font-heading text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary-600" />
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={content.business.name}
                          onChange={(e) => updateBusiness('name', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={content.business.tagline}
                          onChange={(e) => updateBusiness('tagline', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection('contact')}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="font-heading text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary-600" />
                        Contact Information
                      </h3>
                      {expandedSections.contact ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.contact && (
                      <div className="px-6 pb-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                            </label>
                            <input
                              type="tel"
                              value={content.business.phone}
                              onChange={(e) => updateBusiness('phone', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <Mail className="w-4 h-4 inline mr-1" /> Email Address
                            </label>
                            <input
                              type="email"
                              value={content.business.email}
                              onChange={(e) => updateBusiness('email', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-1" /> WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={content.business.whatsapp}
                            onChange={(e) => updateBusiness('whatsapp', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" /> Service Area
                          </label>
                          <input
                            type="text"
                            value={content.business.address.city}
                            onChange={(e) =>
                              updateBusiness('address', {
                                ...content.business.address,
                                city: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Hours */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection('hours')}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="font-heading text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        Business Hours
                      </h3>
                      {expandedSections.hours ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.hours && (
                      <div className="px-6 pb-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Monday - Friday
                            </label>
                            <input
                              type="text"
                              value={content.business.hours.weekdays}
                              onChange={(e) =>
                                updateBusiness('hours', {
                                  ...content.business.hours,
                                  weekdays: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Saturday
                            </label>
                            <input
                              type="text"
                              value={content.business.hours.saturday}
                              onChange={(e) =>
                                updateBusiness('hours', {
                                  ...content.business.hours,
                                  saturday: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Sunday
                            </label>
                            <input
                              type="text"
                              value={content.business.hours.sunday}
                              onChange={(e) =>
                                updateBusiness('hours', {
                                  ...content.business.hours,
                                  sunday: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && content && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h3 className="font-heading text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary-600" />
                      Business Statistics
                    </h3>
                    <p className="text-slate-500 mb-6">
                      These numbers are displayed across your website to build trust with potential clients.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={content.stats.yearsExperience}
                          onChange={(e) => updateStats('yearsExperience', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-2xl font-bold text-navy-900"
                        />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Projects Completed
                        </label>
                        <input
                          type="number"
                          value={content.stats.projectsCompleted}
                          onChange={(e) => updateStats('projectsCompleted', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-2xl font-bold text-navy-900"
                        />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Client Satisfaction (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={content.stats.clientSatisfaction}
                          onChange={(e) => updateStats('clientSatisfaction', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-2xl font-bold text-navy-900"
                        />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Star Rating (out of 5)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={content.stats.starRating}
                          onChange={(e) => updateStats('starRating', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-2xl font-bold text-navy-900"
                        />
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Referral Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={content.stats.referralRate}
                          onChange={(e) => updateStats('referralRate', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-2xl font-bold text-navy-900"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && content && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Electrical Services */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection('electrical')}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-heading text-xl font-bold text-navy-900">
                            {content.services?.electrical?.title || 'Electrical Services'}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {content.services?.electrical?.items?.length || 0} service items
                          </p>
                        </div>
                      </div>
                      {expandedSections.electrical ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.electrical && (
                      <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Category Title
                            </label>
                            <input
                              type="text"
                              value={content.services?.electrical?.title || ''}
                              onChange={(e) => updateServiceCategory('electrical', 'title', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Badge Text
                            </label>
                            <input
                              type="text"
                              value={content.services?.electrical?.badge || ''}
                              onChange={(e) => updateServiceCategory('electrical', 'badge', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category Description
                          </label>
                          <textarea
                            value={content.services?.electrical?.description || ''}
                            onChange={(e) => updateServiceCategory('electrical', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                          />
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-navy-900">Service Items</h4>
                            <button
                              onClick={() => addServiceItem('electrical')}
                              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Service
                            </button>
                          </div>
                          <div className="space-y-3">
                            {content.services?.electrical?.items?.map((item, index) => (
                              <div key={index} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateServiceItem('electrical', index, 'title', e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-amber-300 focus:border-amber-500 font-semibold bg-white"
                                    placeholder="Service title"
                                  />
                                  <button
                                    onClick={() => deleteServiceItem('electrical', index)}
                                    className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateServiceItem('electrical', index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:border-amber-500 text-sm resize-none bg-white"
                                  placeholder="Service description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Carpentry Services */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection('carpentry')}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
                          <Hammer className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-heading text-xl font-bold text-navy-900">
                            {content.services?.carpentry?.title || 'Carpentry & Joinery'}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {content.services?.carpentry?.items?.length || 0} service items
                          </p>
                        </div>
                      </div>
                      {expandedSections.carpentry ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.carpentry && (
                      <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Category Title
                            </label>
                            <input
                              type="text"
                              value={content.services?.carpentry?.title || ''}
                              onChange={(e) => updateServiceCategory('carpentry', 'title', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Badge Text
                            </label>
                            <input
                              type="text"
                              value={content.services?.carpentry?.badge || ''}
                              onChange={(e) => updateServiceCategory('carpentry', 'badge', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category Description
                          </label>
                          <textarea
                            value={content.services?.carpentry?.description || ''}
                            onChange={(e) => updateServiceCategory('carpentry', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                          />
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-navy-900">Service Items</h4>
                            <button
                              onClick={() => addServiceItem('carpentry')}
                              className="flex items-center gap-2 px-3 py-1.5 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Service
                            </button>
                          </div>
                          <div className="space-y-3">
                            {content.services?.carpentry?.items?.map((item, index) => (
                              <div key={index} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateServiceItem('carpentry', index, 'title', e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-amber-300 focus:border-amber-500 font-semibold bg-white"
                                    placeholder="Service title"
                                  />
                                  <button
                                    onClick={() => deleteServiceItem('carpentry', index)}
                                    className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateServiceItem('carpentry', index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:border-amber-500 text-sm resize-none bg-white"
                                  placeholder="Service description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Home Improvements / Renovation Services */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection('renovation')}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-heading text-xl font-bold text-navy-900">
                            {content.services?.renovation?.title || 'Home Improvements'}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {content.services?.renovation?.items?.length || 0} service items
                          </p>
                        </div>
                      </div>
                      {expandedSections.renovation ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedSections.renovation && (
                      <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Category Title
                            </label>
                            <input
                              type="text"
                              value={content.services?.renovation?.title || ''}
                              onChange={(e) => updateServiceCategory('renovation', 'title', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Badge Text
                            </label>
                            <input
                              type="text"
                              value={content.services?.renovation?.badge || ''}
                              onChange={(e) => updateServiceCategory('renovation', 'badge', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category Description
                          </label>
                          <textarea
                            value={content.services?.renovation?.description || ''}
                            onChange={(e) => updateServiceCategory('renovation', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                          />
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-navy-900">Service Items</h4>
                            <button
                              onClick={() => addServiceItem('renovation')}
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Service
                            </button>
                          </div>
                          <div className="space-y-3">
                            {content.services?.renovation?.items?.map((item, index) => (
                              <div key={index} className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateServiceItem('renovation', index, 'title', e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-primary-300 focus:border-primary-500 font-semibold bg-white"
                                    placeholder="Service title"
                                  />
                                  <button
                                    onClick={() => deleteServiceItem('renovation', index)}
                                    className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateServiceItem('renovation', index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-lg border border-primary-300 focus:border-primary-500 text-sm resize-none bg-white"
                                  placeholder="Service description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && content && (
                <motion.div
                  key="testimonials"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-xl font-bold text-navy-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        Client Testimonials
                      </h3>
                      <button
                        onClick={addTestimonial}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Testimonial
                      </button>
                    </div>

                    <div className="space-y-4">
                      {content.testimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                  Client Name
                                </label>
                                <input
                                  type="text"
                                  value={testimonial.name}
                                  onChange={(e) =>
                                    updateTestimonial(testimonial.id, 'name', e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={testimonial.location}
                                  onChange={(e) =>
                                    updateTestimonial(testimonial.id, 'location', e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                  Service
                                </label>
                                <select
                                  value={testimonial.service}
                                  onChange={(e) =>
                                    updateTestimonial(testimonial.id, 'service', e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500"
                                >
                                  <option value="electrical">Electrical</option>
                                  <option value="carpentry">Carpentry</option>
                                  <option value="renovation">Renovation</option>
                                </select>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteTestimonial(testimonial.id)}
                              className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mb-4">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Testimonial Text
                            </label>
                            <textarea
                              value={testimonial.text}
                              onChange={(e) =>
                                updateTestimonial(testimonial.id, 'text', e.target.value)
                              }
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() =>
                                      updateTestimonial(testimonial.id, 'rating', star)
                                    }
                                    className={`p-1 ${
                                      star <= testimonial.rating
                                        ? 'text-amber-500'
                                        : 'text-slate-300'
                                    }`}
                                  >
                                    <Star className="w-5 h-5 fill-current" />
                                  </button>
                                ))}
                              </div>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={testimonial.featured}
                                  onChange={(e) =>
                                    updateTestimonial(testimonial.id, 'featured', e.target.checked)
                                  }
                                  className="w-4 h-4 text-primary-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Featured</span>
                              </label>
                            </div>
                            <input
                              type="date"
                              value={testimonial.date}
                              onChange={(e) =>
                                updateTestimonial(testimonial.id, 'date', e.target.value)
                              }
                              className="px-3 py-1 rounded-lg border border-slate-200 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && content && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary-600" />
                        Portfolio Projects
                      </h3>
                      <button
                        onClick={addPortfolioItem}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Project
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {content.portfolio.map((project) => (
                        <div
                          key={project.id}
                          className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-4">
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) =>
                                updatePortfolioItem(project.id, 'title', e.target.value)
                              }
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 font-semibold"
                            />
                            <button
                              onClick={() => deletePortfolioItem(project.id)}
                              className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Category
                              </label>
                              <select
                                value={project.category}
                                onChange={(e) =>
                                  updatePortfolioItem(project.id, 'category', e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 text-sm"
                              >
                                <option value="electrical">Electrical</option>
                                <option value="carpentry">Carpentry</option>
                                <option value="renovation">Renovation</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Year
                              </label>
                              <input
                                type="text"
                                value={project.year}
                                onChange={(e) =>
                                  updatePortfolioItem(project.id, 'year', e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 text-sm"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={project.location}
                              onChange={(e) =>
                                updatePortfolioItem(project.id, 'location', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 text-sm"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                              Description
                            </label>
                            <textarea
                              value={project.description}
                              onChange={(e) =>
                                updatePortfolioItem(project.id, 'description', e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 text-sm resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={project.featured}
                                onChange={(e) =>
                                  updatePortfolioItem(project.id, 'featured', e.target.checked)
                                }
                                className="w-4 h-4 text-primary-600 rounded"
                              />
                              <span className="text-sm text-slate-600">Featured Project</span>
                            </label>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition-colors">
                              <Upload className="w-4 h-4" />
                              Add Images
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <SettingsTab adminEmail={adminEmail} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
