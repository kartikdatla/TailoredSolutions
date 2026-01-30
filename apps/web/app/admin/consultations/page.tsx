'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Video,
  FileText,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Download,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Zap,
  Hammer,
  Home,
  Sparkles,
  BarChart3,
  TrendingUp,
  Users,
  PoundSterling,
  ArrowLeft,
  Settings,
  RefreshCw,
  MoreVertical,
  Mic,
  FileAudio,
} from 'lucide-react';

// Types
interface ConsultationSummary {
  id: string;
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  propertyAddress?: string;
  serviceCategory: 'electrical' | 'carpentry' | 'home-improvement' | 'general';
  consultationDate: Date;
  duration: number;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  meetingUrl?: string;
  recordingUrl?: string;
  documentStatus: 'ready' | 'generating' | 'pending' | 'failed';
  estimatedBudget?: {
    min: number;
    max: number;
  };
  keyFindings?: string[];
  createdAt: Date;
}

// Service category icons
const categoryIcons: Record<string, typeof Zap> = {
  electrical: Zap,
  carpentry: Hammer,
  'home-improvement': Home,
  general: Sparkles,
};

const categoryColors: Record<string, string> = {
  electrical: 'bg-amber-100 text-amber-700',
  carpentry: 'bg-orange-100 text-orange-700',
  'home-improvement': 'bg-blue-100 text-blue-700',
  general: 'bg-purple-100 text-purple-700',
};

// Mock data
const mockConsultations: ConsultationSummary[] = [
  {
    id: 'con-001',
    bookingId: 'bk-001',
    clientName: 'James Thompson',
    clientEmail: 'james.thompson@email.com',
    clientPhone: '07700 900123',
    propertyAddress: '42 Oak Street, Richmond, London',
    serviceCategory: 'electrical',
    consultationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 45,
    status: 'completed',
    documentStatus: 'ready',
    estimatedBudget: { min: 2500, max: 4000 },
    keyFindings: [
      'Consumer unit requires upgrade to 18th edition',
      'Additional circuits needed for home office',
      'EICR recommended before work begins',
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'con-002',
    bookingId: 'bk-002',
    clientName: 'Sarah Mitchell',
    clientEmail: 'sarah.mitchell@email.com',
    clientPhone: '07700 900456',
    propertyAddress: '15 Cedar Lane, Twickenham',
    serviceCategory: 'carpentry',
    consultationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 60,
    status: 'completed',
    documentStatus: 'ready',
    estimatedBudget: { min: 5000, max: 8500 },
    keyFindings: [
      'Bespoke fitted wardrobes for master bedroom',
      'Floating shelving system in study',
      'Oak finish recommended for durability',
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'con-003',
    bookingId: 'bk-003',
    clientName: 'Michael Chen',
    clientEmail: 'michael.chen@email.com',
    propertyAddress: '8 Riverside Court, Kingston',
    serviceCategory: 'home-improvement',
    consultationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 55,
    status: 'completed',
    documentStatus: 'generating',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'con-004',
    bookingId: 'bk-004',
    clientName: 'Emma Wilson',
    clientEmail: 'emma.wilson@email.com',
    clientPhone: '07700 900789',
    propertyAddress: '27 Park Road, Wimbledon',
    serviceCategory: 'electrical',
    consultationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 40,
    status: 'completed',
    documentStatus: 'ready',
    estimatedBudget: { min: 1800, max: 2500 },
    keyFindings: [
      'Garden lighting installation',
      'Outdoor socket installation',
      'Armoured cable run required',
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'con-005',
    bookingId: 'bk-005',
    clientName: 'David Brown',
    clientEmail: 'david.brown@email.com',
    propertyAddress: '3 Victoria Terrace, Surbiton',
    serviceCategory: 'general',
    consultationDate: new Date(),
    duration: 0,
    status: 'pending',
    documentStatus: 'pending',
    createdAt: new Date(),
  },
];

// Stats calculations
const getStats = (consultations: ConsultationSummary[]) => {
  const completed = consultations.filter(c => c.status === 'completed');
  const totalBudget = completed.reduce((sum, c) => {
    if (c.estimatedBudget) {
      return sum + (c.estimatedBudget.min + c.estimatedBudget.max) / 2;
    }
    return sum;
  }, 0);

  return {
    total: consultations.length,
    completed: completed.length,
    pending: consultations.filter(c => c.status === 'pending').length,
    processing: consultations.filter(c => c.status === 'processing' || c.documentStatus === 'generating').length,
    avgDuration: completed.length > 0
      ? Math.round(completed.reduce((sum, c) => sum + c.duration, 0) / completed.length)
      : 0,
    totalEstimatedValue: totalBudget,
  };
};

export default function ConsultationsDashboard() {
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationSummary | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConsultations(mockConsultations);
      setFilteredConsultations(mockConsultations);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...consultations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.clientName.toLowerCase().includes(query) ||
          c.clientEmail.toLowerCase().includes(query) ||
          c.propertyAddress?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.serviceCategory === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }

    setFilteredConsultations(filtered);
  }, [consultations, searchQuery, selectedCategory, selectedStatus]);

  const stats = getStats(consultations);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      ready: 'bg-green-100 text-green-700',
      generating: 'bg-blue-100 text-blue-700',
    };

    const statusIcons: Record<string, React.ReactNode> = {
      completed: <CheckCircle className="w-3 h-3" />,
      processing: <Loader2 className="w-3 h-3 animate-spin" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <AlertCircle className="w-3 h-3" />,
      ready: <CheckCircle className="w-3 h-3" />,
      generating: <Loader2 className="w-3 h-3 animate-spin" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Admin Header - Full width dark header with proper spacing for fixed nav */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link href="/admin/calendar" className="text-white/60 hover:text-white transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white font-medium">Consultations</span>
          </div>

          {/* Page Title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">
                Consultation Dashboard
              </h1>
              <p className="text-white/70 text-lg">
                View transcriptions, documents, and client consultation history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/calendar"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-navy-900 hover:bg-gold-400 rounded-xl font-medium transition-all"
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Floating above content */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{stats.total}</div>
                <div className="text-sm text-slate-500 font-medium">Total</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{stats.completed}</div>
                <div className="text-sm text-slate-500 font-medium">Completed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{stats.pending}</div>
                <div className="text-sm text-slate-500 font-medium">Pending</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{stats.processing}</div>
                <div className="text-sm text-slate-500 font-medium">Processing</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900">{stats.avgDuration}m</div>
                <div className="text-sm text-slate-500 font-medium">Avg Duration</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
                <PoundSterling className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy-900">{formatCurrency(stats.totalEstimatedValue)}</div>
                <div className="text-sm text-slate-500 font-medium">Est. Value</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, email, or address..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('electrical')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === 'electrical'
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                Electrical
              </button>
              <button
                onClick={() => setSelectedCategory('carpentry')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === 'carpentry'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Hammer className="w-4 h-4" />
                Carpentry
              </button>
              <button
                onClick={() => setSelectedCategory('home-improvement')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === 'home-improvement'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                Renovation
              </button>
            </div>

            {/* Advanced Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                showFilters
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Advanced</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-100"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Consultation Status
                    </label>
                    <div className="space-y-2">
                      {['all', 'completed', 'pending', 'processing', 'failed'].map((status) => (
                        <label key={status} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={selectedStatus === status}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                          />
                          <span className="text-slate-600 group-hover:text-slate-900 capitalize">
                            {status === 'all' ? 'All Statuses' : status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Document Status */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Document Status
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                        <span className="text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-500" />
                          Document Ready
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                        <span className="text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-blue-500" />
                          Generating
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                        <span className="text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-purple-500" />
                          Transcribing
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Date Range
                    </label>
                    <div className="space-y-3">
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-600"
                        placeholder="From"
                      />
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-slate-600"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Clear All
                  </button>
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors">
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-navy-900">{filteredConsultations.length}</span> of{' '}
            <span className="font-semibold text-navy-900">{consultations.length}</span> consultations
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <select className="border-0 bg-transparent font-medium text-navy-900 focus:ring-0 cursor-pointer">
              <option>Most Recent</option>
              <option>Oldest First</option>
              <option>Budget (High to Low)</option>
              <option>Budget (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Consultations List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
            <p className="text-slate-500 font-medium">Loading consultations...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-100"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-heading text-2xl font-semibold text-navy-900 mb-2">
              No consultations found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Consultations will appear here once clients book and complete their video calls'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            {filteredConsultations.map((consultation, index) => {
              const CategoryIcon = categoryIcons[consultation.serviceCategory];

              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all group"
                >
                  {/* Card Header with Category Indicator */}
                  <div className={`h-1.5 ${
                    consultation.serviceCategory === 'electrical' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                    consultation.serviceCategory === 'carpentry' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    consultation.serviceCategory === 'home-improvement' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                    'bg-gradient-to-r from-purple-400 to-purple-500'
                  }`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left: Client Info */}
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                          consultation.serviceCategory === 'electrical' ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' :
                          consultation.serviceCategory === 'carpentry' ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                          consultation.serviceCategory === 'home-improvement' ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white' :
                          'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
                        }`}>
                          <CategoryIcon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-heading text-xl font-bold text-navy-900 group-hover:text-primary-600 transition-colors">
                              {consultation.clientName}
                            </h3>
                            {getStatusBadge(consultation.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer">
                              <Mail className="w-4 h-4" />
                              {consultation.clientEmail}
                            </span>
                            {consultation.clientPhone && (
                              <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer">
                                <Phone className="w-4 h-4" />
                                {consultation.clientPhone}
                              </span>
                            )}
                          </div>
                          {consultation.propertyAddress && (
                            <p className="flex items-center gap-1.5 mt-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {consultation.propertyAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedConsultation(consultation)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-primary-100 text-slate-600 hover:text-primary-600 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                          title="More Options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700 font-medium">{formatDate(consultation.consultationDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700 font-medium">
                            {consultation.duration > 0 ? `${consultation.duration} mins` : 'Scheduled'}
                          </span>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                          consultation.serviceCategory === 'electrical' ? 'bg-amber-100 text-amber-700' :
                          consultation.serviceCategory === 'carpentry' ? 'bg-orange-100 text-orange-700' :
                          consultation.serviceCategory === 'home-improvement' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {consultation.serviceCategory.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Document Status */}
                        {consultation.documentStatus === 'ready' && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium shadow-lg shadow-green-500/20">
                            <FileText className="w-4 h-4" />
                            View Document
                          </button>
                        )}
                        {consultation.documentStatus === 'generating' && (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-medium">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating Document...
                          </span>
                        )}
                        {consultation.documentStatus === 'pending' && (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            Awaiting Consultation
                          </span>
                        )}

                        {/* Budget */}
                        {consultation.estimatedBudget && (
                          <div className="text-right pl-4 border-l border-slate-200">
                            <div className="text-xs text-slate-500 font-medium">Est. Budget</div>
                            <div className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                              {formatCurrency(consultation.estimatedBudget.min)} - {formatCurrency(consultation.estimatedBudget.max)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Findings Preview */}
                    {consultation.keyFindings && consultation.keyFindings.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-gold-500" />
                          <h4 className="text-sm font-semibold text-navy-900">
                            Key Findings from AI Analysis
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {consultation.keyFindings.map((finding, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 rounded-xl text-sm border border-slate-200"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {finding}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More / Pagination */}
        {filteredConsultations.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-slate-200 text-slate-400 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary-600 text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-600 font-medium">2</button>
              <button className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-600 font-medium">3</button>
              <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Consultation Detail Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[selectedConsultation.serviceCategory]}`}>
                      {(() => {
                        const Icon = categoryIcons[selectedConsultation.serviceCategory];
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-navy-900">
                        {selectedConsultation.clientName}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {formatDate(selectedConsultation.consultationDate)} at {formatTime(selectedConsultation.consultationDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {/* Status Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Consultation Status</div>
                      {getStatusBadge(selectedConsultation.status)}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Document Status</div>
                      {getStatusBadge(selectedConsultation.documentStatus)}
                    </div>
                  </div>

                  {/* Client Details */}
                  <div>
                    <h4 className="font-heading font-semibold text-navy-900 mb-3">Client Details</h4>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{selectedConsultation.clientEmail}</span>
                      </div>
                      {selectedConsultation.clientPhone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{selectedConsultation.clientPhone}</span>
                        </div>
                      )}
                      {selectedConsultation.propertyAddress && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{selectedConsultation.propertyAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consultation Info */}
                  <div>
                    <h4 className="font-heading font-semibold text-navy-900 mb-3">Consultation Info</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-500">Service Category</div>
                        <div className="font-medium text-navy-900 capitalize mt-1">
                          {selectedConsultation.serviceCategory.replace('-', ' ')}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-500">Duration</div>
                        <div className="font-medium text-navy-900 mt-1">
                          {selectedConsultation.duration > 0 ? `${selectedConsultation.duration} minutes` : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Budget */}
                  {selectedConsultation.estimatedBudget && (
                    <div>
                      <h4 className="font-heading font-semibold text-navy-900 mb-3">Estimated Budget</h4>
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                        <div className="text-center">
                          <div className="text-primary-100 text-sm mb-1">Project Estimate</div>
                          <div className="text-3xl font-bold">
                            {formatCurrency(selectedConsultation.estimatedBudget.min)} - {formatCurrency(selectedConsultation.estimatedBudget.max)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Findings */}
                  {selectedConsultation.keyFindings && selectedConsultation.keyFindings.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-navy-900 mb-3">Key Findings</h4>
                      <ul className="space-y-2">
                        {selectedConsultation.keyFindings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                {selectedConsultation.recordingUrl && (
                  <button className="btn btn-outline flex-1 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    View Recording
                  </button>
                )}
                {selectedConsultation.documentStatus === 'ready' && (
                  <button className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Document
                  </button>
                )}
                {selectedConsultation.documentStatus !== 'ready' && (
                  <button className="btn btn-outline flex-1" onClick={() => setSelectedConsultation(null)}>
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
