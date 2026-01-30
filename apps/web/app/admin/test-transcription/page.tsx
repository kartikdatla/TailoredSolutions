'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Mic,
  Play,
  Pause,
  Square,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Volume2,
  Download,
  Eye,
  Zap,
  Hammer,
  Clock,
  PoundSterling,
  ArrowRight,
  Edit3,
  Save,
  Send,
  Plus,
  Trash2,
  X,
  GripVertical,
  AlertTriangle,
  Mail,
} from 'lucide-react';

// Simulated transcription result
const mockTranscriptionResult = {
  text: `Consultant: Good morning! Thank you for joining this consultation. I understand you're looking at some electrical work for your property. Can you tell me a bit about what you're hoping to achieve?

Client: Yes, hi! So we've got an older property, built in the 1970s, and I'm a bit worried about the electrics. The fuse box looks quite dated, and we've been having some issues with the lights flickering in the kitchen. Also, we're thinking about converting the garage into a home office, so we'd need power out there.

Consultant: That's really helpful context. Properties from the 1970s often still have the original consumer unit - what we used to call a fuse box. The flickering lights could indicate a few things - it might be a loose connection, or it could be that the circuit is overloaded. Have you noticed if it happens when you use specific appliances?

Client: Now you mention it, yes - it seems to happen more when the kettle and toaster are on at the same time.

Consultant: That's a classic sign of an overloaded circuit. Modern kitchens have much higher electrical demands than they did 50 years ago. What I'd recommend is firstly upgrading your consumer unit to a modern one with RCDs - these are safety devices that cut the power instantly if there's a fault, which is much safer than the old rewirable fuses.

Client: How much would something like that cost?

Consultant: For a consumer unit upgrade, you're typically looking at between £400 to £600 depending on the number of circuits. Now, for the garage conversion, we'd need to run a dedicated supply out there. Given it's going to be a home office, I'd suggest a mini consumer unit in the garage with its own circuits for lighting, power sockets, and potentially a dedicated circuit if you're planning to have any high-powered equipment.

Client: That makes sense. What about the total cost for everything?

Consultant: For the complete package - consumer unit upgrade, investigating and fixing the kitchen circuit issue, plus the garage conversion with a proper electrical installation - you're looking at roughly £2,500 to £3,500. That would include certification, which is important because any electrical work needs to be signed off under Part P building regulations.

Client: And how long would all this take?

Consultant: The consumer unit and kitchen work could be done in a day. The garage would depend on how we route the cable, but typically 2-3 days for the electrical first fix, then we'd need to come back after any plastering for the second fix. So overall, probably about a week of actual work, though not necessarily consecutive days.

Client: That sounds reasonable. What would be the next steps?

Consultant: I'll send you a detailed quote document breaking down each element. If you're happy to proceed, we'd book in a start date, take a 30% deposit, and then the balance would be due on completion. We're usually about 3-4 weeks out for new jobs at the moment.

Client: Perfect, that all sounds great. One more question - do you handle the building control notification for the Part P work?

Consultant: Absolutely, yes. We're registered with NICEIC, so we self-certify all our work and handle all the paperwork. You'll receive an Electrical Installation Certificate and the work will be registered with your local building control.

Client: Brilliant, thank you so much for explaining everything so clearly.

Consultant: You're welcome! I'll get that quote over to you within 24 hours. Thanks for your time today.`,
  duration: 847,
  language: 'en',
  segments: [
    { start: 0, end: 15, text: 'Consultant greeting and initial question' },
    { start: 15, end: 45, text: 'Client describes property and concerns' },
    { start: 45, end: 90, text: 'Discussion about flickering lights' },
    { start: 90, end: 150, text: 'Consumer unit upgrade recommendation' },
    { start: 150, end: 200, text: 'Cost discussion for consumer unit' },
    { start: 200, end: 280, text: 'Garage conversion electrical requirements' },
    { start: 280, end: 350, text: 'Total project cost estimate' },
    { start: 350, end: 420, text: 'Timeline discussion' },
    { start: 420, end: 500, text: 'Next steps and booking process' },
    { start: 500, end: 600, text: 'Part P certification discussion' },
  ],
};

// Simulated AI summary
const mockAISummary = {
  title: 'Electrical Upgrade & Garage Conversion Consultation',
  summary: `This consultation covered a comprehensive electrical assessment for a 1970s property. The client expressed concerns about an outdated fuse box, flickering kitchen lights (identified as circuit overload from simultaneous kettle and toaster use), and requirements for a garage-to-home-office conversion.

The recommended solution includes upgrading the consumer unit to a modern RCD-protected board, investigating and resolving the kitchen circuit overload, and installing a complete electrical system in the garage with its own mini consumer unit.

All work will be certified under Part P building regulations through NICEIC registration, with full documentation provided including an Electrical Installation Certificate.`,
  keyPoints: [
    'Consumer unit upgrade from 1970s fuse box to modern RCD-protected board',
    'Kitchen circuit investigation - flickering caused by overload (kettle + toaster)',
    'Garage conversion requires dedicated supply with mini consumer unit',
    'Home office will have separate circuits for lighting, sockets, and high-powered equipment',
    'All work Part P compliant with NICEIC self-certification',
    'Electrical Installation Certificate provided upon completion',
  ],
  recommendations: [
    'Upgrade consumer unit as priority for safety compliance',
    'Add dedicated kitchen circuit to handle modern appliance loads',
    'Install mini consumer unit in garage for independent circuit protection',
    'Consider future-proofing with additional socket capacity in home office',
  ],
  nextSteps: [
    'Detailed quote to be sent within 24 hours',
    'Client to review and confirm acceptance',
    '30% deposit required to book start date',
    'Current lead time approximately 3-4 weeks',
    'Work duration: ~1 week (non-consecutive days)',
  ],
  estimatedCost: {
    min: 2500,
    max: 3500,
    notes: 'Includes consumer unit upgrade, kitchen circuit fix, and complete garage electrical installation with certification',
  },
  questionsFromClient: [
    'How much would a consumer unit upgrade cost?',
    'What is the total cost for everything?',
    'How long would the work take?',
    'Do you handle building control notification?',
  ],
  materialsDiscussed: [
    'Modern consumer unit with RCDs',
    'Mini consumer unit for garage',
    'Armoured cable for external run',
    'Electrical Installation Certificate',
  ],
};

// Simulated document sections
const mockDocumentSections = {
  executiveSummary: {
    projectOverview: `Following our video consultation, we're pleased to provide this comprehensive proposal for upgrading your electrical system. Your 1970s property would benefit significantly from modernisation, both for safety compliance and to meet the demands of contemporary living.

We've identified three key areas of work: upgrading your consumer unit to current safety standards, resolving the kitchen circuit overload that's causing your light flickering, and creating a fully-equipped electrical installation in your garage for its new life as a home office.

This proposal outlines exactly what we'll do, why it matters, and what you can expect at each stage.`,
    mainObjectives: [
      'Upgrade consumer unit to 18th Edition standards with RCD protection',
      'Investigate and resolve kitchen circuit overload',
      'Install complete garage electrical system for home office use',
      'Ensure full Part P compliance with proper certification',
    ],
    estimatedTimeline: '5-7 working days over 2-3 weeks',
    budgetRange: { min: 2500, max: 3500, currency: 'GBP' },
  },
  technicalAssessment: {
    currentCondition: 'Property features original 1970s electrical installation with rewirable fuse board. Kitchen circuit showing signs of overload. No electrical supply currently in garage.',
    workRequired: [
      {
        area: 'Consumer Unit',
        description: 'Replace existing fuse box with modern consumer unit',
        technicalDetails: '18th Edition compliant, dual RCD split-load board, 10-way minimum, 100A main switch, Type A RCDs for EV readiness',
        laymanExplanation: "Think of your fuse box like the heart of your home's electrical system. Your current one is like a 50-year-old car engine - it works, but modern safety features didn't exist back then. A new consumer unit has devices called RCDs that can detect faults in milliseconds and cut the power before anyone gets hurt. It's like having airbags for your electrical system.",
        priority: 'essential' as const,
        estimatedCost: { min: 450, max: 600 },
      },
      {
        area: 'Kitchen Circuit',
        description: 'Install dedicated ring circuit for kitchen appliances',
        technicalDetails: '32A ring circuit, 2.5mm² T&E cable, dedicated MCB, minimum 6 double sockets',
        laymanExplanation: "Your kitchen lights flicker because too many hungry appliances are sharing one circuit - like too many people drinking from one straw. We'll give your kitchen its own dedicated electrical 'pipeline' so your kettle and toaster can work together without fighting for power.",
        priority: 'essential' as const,
        estimatedCost: { min: 350, max: 500 },
      },
      {
        area: 'Garage Electrical Installation',
        description: 'Complete electrical fit-out for home office conversion',
        technicalDetails: 'SWA cable supply, garage consumer unit (6-way), 2x lighting circuits, 2x socket circuits, dedicated 32A circuit for future AC/heater',
        laymanExplanation: "We'll run a proper armoured cable from your house to the garage - it's designed to be buried underground safely. The garage will get its own mini electrical panel, so if something trips out there, your house stays on. You'll have plenty of sockets for your desk, monitors, and equipment, plus good lighting to work by.",
        priority: 'recommended' as const,
        estimatedCost: { min: 1200, max: 1800 },
      },
    ],
    complianceNotes: [
      'All work compliant with BS 7671:2018+A2:2022 (18th Edition)',
      'Part P Building Regulations notification via NICEIC self-certification',
      'Electrical Installation Certificate (EIC) provided',
      'Work registered with Local Authority Building Control',
    ],
    safetyConsiderations: [
      'Current installation lacks RCD protection - shock risk',
      'Overloaded circuits present fire risk',
      'Garage work to include IP-rated accessories for unheated space',
    ],
  },
};

type ProcessStep = 'idle' | 'recording' | 'transcribing' | 'analyzing' | 'generating' | 'complete';

// Editable work item interface
interface EditableWorkItem {
  id: string;
  area: string;
  description: string;
  technicalDetails: string;
  laymanExplanation: string;
  priority: 'essential' | 'recommended' | 'optional';
  estimatedCost: { min: number; max: number };
  isEditing?: boolean;
}

export default function TestTranscriptionPage() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('idle');
  const [progress, setProgress] = useState(0);
  const [transcription, setTranscription] = useState<typeof mockTranscriptionResult | null>(null);
  const [summary, setSummary] = useState<typeof mockAISummary | null>(null);
  const [document, setDocument] = useState<typeof mockDocumentSections | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Quotation editing state
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editableWorkItems, setEditableWorkItems] = useState<EditableWorkItem[]>([]);
  const [editableTimeline, setEditableTimeline] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [clientEmail, setClientEmail] = useState('john.smith@email.com');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(amount);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize editable work items from document
  const initializeEditableItems = () => {
    if (document) {
      const items = document.technicalAssessment.workRequired.map((item, idx) => ({
        id: `item-${idx}`,
        area: item.area,
        description: item.description,
        technicalDetails: item.technicalDetails,
        laymanExplanation: item.laymanExplanation,
        priority: item.priority,
        estimatedCost: { ...item.estimatedCost },
        isEditing: false,
      }));
      setEditableWorkItems(items);
      setEditableTimeline(document.executiveSummary.estimatedTimeline);
      setIsEditingQuote(true);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotalMin = editableWorkItems.reduce((sum, item) => sum + item.estimatedCost.min, 0);
    const subtotalMax = editableWorkItems.reduce((sum, item) => sum + item.estimatedCost.max, 0);
    const discountMin = (subtotalMin * discountPercent) / 100;
    const discountMax = (subtotalMax * discountPercent) / 100;
    return {
      subtotalMin,
      subtotalMax,
      discountMin,
      discountMax,
      totalMin: subtotalMin - discountMin,
      totalMax: subtotalMax - discountMax,
    };
  };

  // Update work item
  const updateWorkItem = (id: string, field: keyof EditableWorkItem, value: string | number | { min: number; max: number }) => {
    setEditableWorkItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Add new work item
  const addWorkItem = () => {
    const newItem: EditableWorkItem = {
      id: `item-${Date.now()}`,
      area: 'New Work Item',
      description: 'Enter description',
      technicalDetails: 'Enter technical details',
      laymanExplanation: 'Explain in simple terms what this means for the client',
      priority: 'recommended',
      estimatedCost: { min: 0, max: 0 },
      isEditing: true,
    };
    setEditableWorkItems([...editableWorkItems, newItem]);
  };

  // Remove work item
  const removeWorkItem = (id: string) => {
    setEditableWorkItems(items => items.filter(item => item.id !== id));
  };

  // Save quotation
  const handleSaveQuotation = async () => {
    setIsSaving(true);
    // Simulate saving to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Send quotation to client
  const handleSendQuotation = async () => {
    setIsSending(true);
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    setShowSendModal(false);
    // Show success message
    alert(`Quotation sent successfully to ${clientEmail}!`);
  };

  const simulateRecording = () => {
    setCurrentStep('recording');
    setElapsedTime(0);
    setProgress(0);

    // Simulate recording for 5 seconds
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          simulateTranscription();
          return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const simulateTranscription = () => {
    setCurrentStep('transcribing');
    setProgress(0);

    // Simulate transcription progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTranscription(mockTranscriptionResult);
          simulateAnalysis();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const simulateAnalysis = () => {
    setCurrentStep('analyzing');
    setProgress(0);

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSummary(mockAISummary);
          simulateDocumentGeneration();
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  const simulateDocumentGeneration = () => {
    setCurrentStep('generating');
    setProgress(0);

    // Simulate document generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDocument(mockDocumentSections);
          setCurrentStep('complete');
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };

  const resetDemo = () => {
    setCurrentStep('idle');
    setProgress(0);
    setTranscription(null);
    setSummary(null);
    setDocument(null);
    setShowDocument(false);
    setElapsedTime(0);
  };

  const getStepStatus = (step: ProcessStep) => {
    const steps: ProcessStep[] = ['recording', 'transcribing', 'analyzing', 'generating', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (currentStep === 'idle') return 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <Link href="/admin/consultations" className="text-white/60 hover:text-white transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white font-medium">Test Transcription</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">
                WhisperAI Demo
              </h1>
              <p className="text-white/70 text-lg">
                Test the consultation transcription and document generation pipeline
              </p>
            </div>
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
          <h2 className="font-heading text-xl font-bold text-navy-900 mb-6">Process Pipeline</h2>
          <div className="flex items-center justify-between">
            {[
              { step: 'recording' as ProcessStep, label: 'Recording', icon: Mic },
              { step: 'transcribing' as ProcessStep, label: 'Transcribing', icon: Volume2 },
              { step: 'analyzing' as ProcessStep, label: 'AI Analysis', icon: Sparkles },
              { step: 'generating' as ProcessStep, label: 'Document', icon: FileText },
              { step: 'complete' as ProcessStep, label: 'Complete', icon: CheckCircle },
            ].map((item, index) => {
              const status = getStepStatus(item.step);
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        status === 'completed'
                          ? 'bg-green-500 text-white'
                          : status === 'active'
                          ? 'bg-primary-500 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : status === 'active' ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        status === 'active' ? 'text-primary-600' : status === 'completed' ? 'text-green-600' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-24 h-1 mx-4 rounded ${
                        getStepStatus(['transcribing', 'analyzing', 'generating', 'complete'][index] as ProcessStep) === 'completed' ||
                        getStepStatus(['transcribing', 'analyzing', 'generating', 'complete'][index] as ProcessStep) === 'active'
                          ? 'bg-primary-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          {currentStep !== 'idle' && currentStep !== 'complete' && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">
                  {currentStep === 'recording' && `Recording consultation... ${formatTime(elapsedTime)}`}
                  {currentStep === 'transcribing' && 'Transcribing audio with WhisperAI...'}
                  {currentStep === 'analyzing' && 'Analyzing transcript with GPT-4...'}
                  {currentStep === 'generating' && 'Generating consultation document...'}
                </span>
                <span className="text-primary-600 font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Recording / Transcription */}
          <div className="space-y-6">
            {/* Recording Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-4">
                Simulated Consultation Recording
              </h3>

              {currentStep === 'idle' ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Click the button below to simulate a consultation call. This will demonstrate the full
                    WhisperAI transcription and document generation pipeline.
                  </p>
                  <button
                    onClick={simulateRecording}
                    className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-3 mx-auto"
                  >
                    <Play className="w-6 h-6" />
                    Start Demo Consultation
                  </button>
                </div>
              ) : currentStep === 'recording' ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-red-600 mb-2">{formatTime(elapsedTime)}</p>
                  <p className="text-slate-600">Recording in progress...</p>
                  <p className="text-sm text-slate-400 mt-2">Simulating a consultation about electrical work</p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900">Recording Complete</p>
                      <p className="text-sm text-slate-500">Duration: 14:07 (simulated)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Transcription Result */}
            {transcription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-navy-900">
                    Transcription Result
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    WhisperAI
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {transcription.text}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor(transcription.duration / 60)}:{(transcription.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <span>Language: {transcription.language.toUpperCase()}</span>
                  <span>{transcription.segments.length} segments</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: AI Analysis & Document */}
          <div className="space-y-6">
            {/* AI Summary */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-navy-900">
                    AI Analysis
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    GPT-4
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">{summary.title}</h4>
                    <p className="text-slate-600 text-sm">{summary.summary.substring(0, 200)}...</p>
                  </div>

                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
                    <p className="text-sm text-white/80 mb-1">Estimated Project Cost</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(summary.estimatedCost.min)} - {formatCurrency(summary.estimatedCost.max)}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-navy-900 mb-2 text-sm">Key Points</h5>
                    <ul className="space-y-2">
                      {summary.keyPoints.slice(0, 4).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Document Preview */}
            {document && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-navy-900">
                    Generated Document
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Ready
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-navy-900 mb-2">Executive Summary</h4>
                  <p className="text-slate-600 text-sm">{document.executiveSummary.projectOverview.substring(0, 250)}...</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Timeline</p>
                    <p className="font-semibold text-navy-900">{document.executiveSummary.estimatedTimeline}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Work Items</p>
                    <p className="font-semibold text-navy-900">{document.technicalAssessment.workRequired.length} areas</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDocument(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    <Eye className="w-5 h-5" />
                    View Full Document
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all">
                    <Download className="w-5 h-5" />
                    PDF
                  </button>
                </div>

                {/* Edit Quotation Button */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={initializeEditableItems}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit & Customize Quotation
                  </button>
                </div>
              </motion.div>
            )}

            {/* Completion Message */}
            {currentStep === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold">Pipeline Complete!</h3>
                    <p className="text-white/80">
                      Consultation transcribed, analyzed, and document generated successfully.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <Link
                    href="/admin/consultations"
                    className="flex items-center gap-2 text-white hover:underline"
                  >
                    View in Consultations Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Full Document Modal */}
      <AnimatePresence>
        {showDocument && document && (
          <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy-900">Consultation Document</h2>
                  <p className="text-slate-500">Electrical Upgrade & Garage Conversion</p>
                </div>
                <button
                  onClick={() => setShowDocument(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Square className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {/* Executive Summary */}
                <section className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-primary-500">
                    Executive Summary
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {document.executiveSummary.projectOverview}
                  </p>
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white text-center">
                    <p className="text-white/80 mb-2">Estimated Project Budget</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(document.executiveSummary.budgetRange.min)} - {formatCurrency(document.executiveSummary.budgetRange.max)}
                    </p>
                    <p className="text-white/80 mt-2">Timeline: {document.executiveSummary.estimatedTimeline}</p>
                  </div>
                </section>

                {/* Work Required */}
                <section className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-primary-500">
                    Work Required
                  </h3>
                  <div className="space-y-4">
                    {document.technicalAssessment.workRequired.map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-amber-600" />
                            </div>
                            <h4 className="font-semibold text-navy-900">{item.area}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            item.priority === 'essential' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-slate-700 mb-3">{item.description}</p>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-3">
                          <p className="text-sm font-semibold text-green-800 mb-1">Why this matters:</p>
                          <p className="text-green-700 text-sm">{item.laymanExplanation}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                          <span className="font-semibold">Technical: </span>{item.technicalDetails}
                        </div>
                        <div className="mt-3 text-right">
                          <span className="text-sm text-slate-500">Estimated: </span>
                          <span className="font-bold text-primary-600">
                            {formatCurrency(item.estimatedCost.min)} - {formatCurrency(item.estimatedCost.max)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Compliance */}
                <section className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-primary-500">
                    Compliance & Certification
                  </h3>
                  <ul className="space-y-2">
                    {document.technicalAssessment.complianceNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowDocument(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quotation Editor Modal */}
      <AnimatePresence>
        {isEditingQuote && (
          <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col my-4"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-500 to-orange-500">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h2 className="font-heading text-2xl font-bold flex items-center gap-3">
                      <Edit3 className="w-7 h-7" />
                      Edit Quotation
                    </h2>
                    <p className="text-white/80 mt-1">Customize pricing, work items, and details before sending to client</p>
                  </div>
                  <button
                    onClick={() => setIsEditingQuote(false)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Timeline Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Estimated Timeline
                  </label>
                  <input
                    type="text"
                    value={editableTimeline}
                    onChange={(e) => setEditableTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="e.g., 5-7 working days over 2-3 weeks"
                  />
                </div>

                {/* Work Items */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-bold text-navy-900">Work Items</h3>
                    <button
                      onClick={addWorkItem}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editableWorkItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2 text-slate-400 cursor-move">
                            <GripVertical className="w-5 h-5" />
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>

                          <div className="flex-1 space-y-4">
                            {/* Row 1: Area Name & Priority */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Work Area</label>
                                <input
                                  type="text"
                                  value={item.area}
                                  onChange={(e) => updateWorkItem(item.id, 'area', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                                <select
                                  value={item.priority}
                                  onChange={(e) => updateWorkItem(item.id, 'priority', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border font-medium ${
                                    item.priority === 'essential' ? 'border-red-300 bg-red-50 text-red-700' :
                                    item.priority === 'recommended' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                                    'border-slate-300 bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <option value="essential">Essential</option>
                                  <option value="recommended">Recommended</option>
                                  <option value="optional">Optional</option>
                                </select>
                              </div>
                            </div>

                            {/* Row 2: Description */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateWorkItem(item.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                              />
                            </div>

                            {/* Row 3: Technical Details */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Technical Details</label>
                              <textarea
                                value={item.technicalDetails}
                                onChange={(e) => updateWorkItem(item.id, 'technicalDetails', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm resize-none"
                                rows={2}
                              />
                            </div>

                            {/* Row 4: Layman Explanation */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                                Client-Friendly Explanation
                                <span className="text-green-600 text-xs font-normal">(shown to client)</span>
                              </label>
                              <textarea
                                value={item.laymanExplanation}
                                onChange={(e) => updateWorkItem(item.id, 'laymanExplanation', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm resize-none"
                                rows={3}
                              />
                            </div>

                            {/* Row 5: Pricing */}
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Min Price (£)</label>
                                <div className="relative">
                                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input
                                    type="number"
                                    value={item.estimatedCost.min}
                                    onChange={(e) => updateWorkItem(item.id, 'estimatedCost', { ...item.estimatedCost, min: Number(e.target.value) })}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-bold"
                                  />
                                </div>
                              </div>
                              <div className="text-slate-300 font-bold pt-6">—</div>
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Max Price (£)</label>
                                <div className="relative">
                                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input
                                    type="number"
                                    value={item.estimatedCost.max}
                                    onChange={(e) => updateWorkItem(item.id, 'estimatedCost', { ...item.estimatedCost, max: Number(e.target.value) })}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-bold"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeWorkItem(item.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Discount Section */}
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-amber-900 mb-2">
                        Apply Discount (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-32 px-4 py-2 rounded-lg border border-amber-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold"
                      />
                    </div>
                    {discountPercent > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-amber-700">Discount Amount</p>
                        <p className="text-lg font-bold text-amber-900">
                          -{formatCurrency(calculateTotals().discountMin)} to -{formatCurrency(calculateTotals().discountMax)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Additional Notes for Client
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                    rows={3}
                    placeholder="Add any special notes, terms, or conditions for this quotation..."
                  />
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-xl p-6 text-white">
                  <h4 className="font-semibold text-white/80 mb-4">Quotation Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Subtotal ({editableWorkItems.length} items)</span>
                      <span className="font-semibold">
                        {formatCurrency(calculateTotals().subtotalMin)} - {formatCurrency(calculateTotals().subtotalMax)}
                      </span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex items-center justify-between text-green-400">
                        <span>Discount ({discountPercent}%)</span>
                        <span className="font-semibold">
                          -{formatCurrency(calculateTotals().discountMin)} to -{formatCurrency(calculateTotals().discountMax)}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                      <span className="text-lg font-semibold">Total Estimate</span>
                      <span className="text-2xl font-bold text-gold-400">
                        {formatCurrency(calculateTotals().totalMin)} - {formatCurrency(calculateTotals().totalMax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>Timeline</span>
                      <span>{editableTimeline}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsEditingQuote(false)}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-green-600 font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Saved!
                    </motion.span>
                  )}
                  <button
                    onClick={handleSaveQuotation}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Draft
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20"
                  >
                    <Send className="w-5 h-5" />
                    Send to Client
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Send Quotation Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-heading text-xl font-bold text-navy-900 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary-500" />
                  Send Quotation
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="client@email.com"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-navy-900 mb-2">Quotation Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Items</span>
                      <span className="font-medium">{editableWorkItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total</span>
                      <span className="font-bold text-primary-600">
                        {formatCurrency(calculateTotals().totalMin)} - {formatCurrency(calculateTotals().totalMax)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timeline</span>
                      <span className="font-medium">{editableTimeline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    The client will receive a professional PDF quotation with all work items, pricing, and your contact details.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendQuotation}
                  disabled={isSending || !clientEmail}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Quotation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
