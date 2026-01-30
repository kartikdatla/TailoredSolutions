// ==================================================
// Shared Types for Home Improvements Business Platform
// ==================================================

// ----- Enums & Constants -----

export const SERVICE_CATEGORIES = ['electrical', 'carpentry', 'home-improvement'] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const BOOKING_URGENCY = ['emergency', 'urgent', 'standard', 'flexible'] as const;
export type BookingUrgency = (typeof BOOKING_URGENCY)[number];

export const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const PROPERTY_TYPES = ['house', 'flat', 'commercial', 'other'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const BOOKING_STATUSES = ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PROJECT_STATUSES = ['quoted', 'approved', 'in-progress', 'completed', 'on-hold', 'cancelled'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const CONSULTATION_DOC_TYPES = ['initial-consultation', 'quote', 'project-update', 'completion'] as const;
export type ConsultationDocType = (typeof CONSULTATION_DOC_TYPES)[number];

export const DOCUMENT_STATUSES = ['draft', 'pending-review', 'published', 'archived'] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const MEETING_PLATFORMS = ['teams', 'whatsapp', 'phone', 'in-person'] as const;
export type MeetingPlatform = (typeof MEETING_PLATFORMS)[number];

export const TRANSCRIPTION_STATUSES = ['pending', 'processing', 'completed', 'failed'] as const;
export type TranscriptionStatus = (typeof TRANSCRIPTION_STATUSES)[number];

export const ATTACHMENT_TYPES = ['client-image', 'example-work', 'diagram', 'quote-pdf'] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

// ----- Base Types -----

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ----- Client Types -----

export interface ClientAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Client extends BaseEntity {
  email: string;
  phone: string;
  name: {
    first: string;
    last: string;
  };
  preferredContactMethod: ContactMethod;
  address?: ClientAddress;
  projectIds: string[];
  consultationIds: string[];
  notes: string;
  tags: string[];
}

// ----- Service Types -----

export interface PriceRange {
  min: number;
  max: number;
  unit: 'fixed' | 'hourly' | 'per-sqft';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service extends BaseEntity {
  slug: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  priceRange?: PriceRange;
  images: string[];
  faqs: FAQ[];
  relatedServiceIds: string[];
  displayOrder: number;
  isActive: boolean;
}

// ----- Booking Types -----

export interface BookingContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface BookingServiceInfo {
  category: ServiceCategory;
  description: string;
}

export interface BookingPropertyInfo {
  type: PropertyType;
  location?: string;
}

export interface BookingStatusChange {
  status: BookingStatus;
  changedAt: Date;
  changedBy?: string;
  notes?: string;
}

export interface Booking extends BaseEntity {
  clientId?: string;
  contactInfo: BookingContactInfo;
  service: BookingServiceInfo;
  property: BookingPropertyInfo;
  urgency: BookingUrgency;
  preferredDates: Date[];
  preferredTimes: string[];
  preferredContactMethod: ContactMethod;
  images: string[];
  notes: string;
  status: BookingStatus;
  statusHistory: BookingStatusChange[];
}

// ----- Consultation Types -----

export interface MeetingDetails {
  platform: MeetingPlatform;
  scheduledAt: Date;
  duration?: number;
  recordingUrl?: string;
  teamsEventId?: string;
}

export interface TranscriptionData {
  status: TranscriptionStatus;
  rawText?: string;
  processedAt?: Date;
  whisperJobId?: string;
}

export interface CostEstimate {
  min: number;
  max: number;
  breakdown?: Array<{
    item: string;
    cost: number;
  }>;
  notes?: string;
}

export interface ConsultationAttachment {
  type: AttachmentType;
  url: string;
  caption?: string;
  uploadedBy: 'client' | 'business';
}

export interface ConsultationDocumentContent {
  title: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  nextSteps: string[];
  estimatedCost?: CostEstimate;
  attachments: ConsultationAttachment[];
  status: DocumentStatus;
  publishedAt?: Date;
}

export interface Consultation extends BaseEntity {
  clientId: string;
  bookingId?: string;
  meetingDetails: MeetingDetails;
  transcription?: TranscriptionData;
  document?: ConsultationDocumentContent;
}

// ----- Project Types -----

export interface ProjectTimeline {
  estimatedStart?: Date;
  actualStart?: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
}

export interface ProjectPricing {
  quoted: number;
  final?: number;
  invoiceIds: string[];
}

export interface ProjectUpdate {
  date: Date;
  content: string;
  images?: string[];
  isPublic: boolean;
}

export interface PortfolioImage {
  url: string;
  caption?: string;
  isBefore: boolean;
  isAfter: boolean;
  isFeatured: boolean;
}

export interface ProjectTestimonial {
  quote: string;
  clientName: string;
  clientInitials?: string;
}

export interface ProjectPortfolioData {
  isPublished: boolean;
  publishedAt?: Date;
  images: PortfolioImage[];
  testimonial?: ProjectTestimonial;
}

export interface Project extends BaseEntity {
  clientId: string;
  consultationId?: string;
  title: string;
  category: ServiceCategory;
  subcategory: string;
  description: string;
  status: ProjectStatus;
  timeline: ProjectTimeline;
  pricing: ProjectPricing;
  updates: ProjectUpdate[];
  portfolio?: ProjectPortfolioData;
}

// ----- Portfolio Types -----

export interface PortfolioProject extends BaseEntity {
  projectId?: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  subcategory: string;
  description: string;
  scope: string;
  duration: string;
  completionDate: Date;
  location: string;
  images: PortfolioImage[];
  testimonial?: ProjectTestimonial;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

// ----- User/Auth Types -----

export type UserRole = 'admin' | 'owner';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  lastLoginAt: Date;
}

// ----- API Response Types -----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ----- WhisperAI Types -----

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface WhisperTranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  language: string;
  duration: number;
}

export interface ConsultationSummary {
  title: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  nextSteps: string[];
  estimatedCost?: {
    min: number;
    max: number;
    notes: string;
  };
  questionsFromClient: string[];
  materialsDiscussed: string[];
}

// ----- Form Input Types -----

export interface BookingFormInput {
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: ContactMethod;
  serviceCategory: ServiceCategory;
  serviceDescription: string;
  propertyType: PropertyType;
  urgency: BookingUrgency;
  preferredDates: string[];
  preferredTimes: string[];
  notes?: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ClientFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactMethod: ContactMethod;
  address?: ClientAddress;
  notes?: string;
  tags?: string[];
}

// ----- Consultation Booking Types -----

export const CONSULTATION_BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'] as const;
export type ConsultationBookingStatus = (typeof CONSULTATION_BOOKING_STATUSES)[number];

export interface AvailabilitySlot extends BaseEntity {
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
  bookingId?: string;
  consultationId?: string;
  isRecurring: boolean;
  recurringRule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };
  blockedReason?: string;
  createdBy: string;
}

export interface ConsultationBookingInput {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  slotId: string;
  serviceCategory: ServiceCategory | 'general';
  projectDescription: string;
  urgency: BookingUrgency;
  propertyType: PropertyType;
}

export interface ConsultationBooking extends BaseEntity {
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    postcode: string;
  };
  slotId: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  serviceCategory: ServiceCategory | 'general';
  projectDescription: string;
  urgency: BookingUrgency;
  propertyType: PropertyType;
  status: ConsultationBookingStatus;
  meeting: {
    teamsJoinUrl?: string;
    teamsMeetingId?: string;
    teamsThreadId?: string;
    clientAccessToken?: string;
  };
  consultationId?: string;
  remindersSent: Array<{
    type: 'email' | 'sms' | 'whatsapp';
    sentAt: Date;
    timeBefore: string;
  }>;
  cancellationReason?: string;
  notes: string;
}

// ----- Enhanced Consultation Document Types -----

export interface WorkItem {
  area: string;
  description: string;
  technicalDetails: string;
  laymanExplanation: string;
  priority: 'essential' | 'recommended' | 'optional';
  estimatedCost: {
    min: number;
    max: number;
  };
}

export interface PhaseTask {
  task: string;
  details: string;
  materials?: string[];
  labourHours?: number;
}

export interface WorkPhase {
  phase: number;
  title: string;
  tasks: PhaseTask[];
  estimatedDuration: string;
  costBreakdown: {
    labour: number;
    materials: number;
    total: number;
  };
}

export interface MaterialSpecification {
  item: string;
  specification: string;
  alternatives?: Array<{
    item: string;
    costDifference: number;
    notes: string;
  }>;
  quantity: string;
  unitCost: number;
  totalCost: number;
}

export interface Recommendation {
  title: string;
  description: string;
  reasoning: string;
  impact: 'high' | 'medium' | 'low';
  costImplication: 'increase' | 'decrease' | 'neutral';
}

export interface NextStep {
  step: number;
  action: string;
  owner: 'client' | 'contractor';
  deadline?: string;
  notes?: string;
}

export interface ConsultationDocumentFull extends BaseEntity {
  consultationId: string;
  bookingId: string;
  clientInfo: {
    name: string;
    email: string;
    propertyType: string;
    location: string;
  };
  meetingInfo: {
    date: Date;
    duration: number;
    recordingUrl?: string;
  };
  transcription: {
    status: TranscriptionStatus;
    rawText?: string;
    segments?: Array<{
      speaker: 'client' | 'consultant' | 'agent';
      text: string;
      timestamp: number;
      confidence: number;
    }>;
    processedAt?: Date;
    whisperJobId?: string;
  };
  document: {
    executiveSummary: {
      projectOverview: string;
      mainObjectives: string[];
      estimatedTimeline: string;
      budgetRange: {
        min: number;
        max: number;
        currency: string;
      };
    };
    technicalAssessment: {
      currentCondition: string;
      workRequired: WorkItem[];
      complianceNotes: string[];
      safetyConsiderations: string[];
    };
    scopeOfWork: WorkPhase[];
    materialsSpecification: MaterialSpecification[];
    recommendations: Recommendation[];
    nextSteps: NextStep[];
    termsAndConditions: {
      paymentTerms: string;
      warranty: string;
      cancellationPolicy: string;
      insuranceInfo: string;
    };
    appendices: Array<{
      title: string;
      type: 'diagram' | 'photo' | 'specification' | 'certification';
      url?: string;
      content?: string;
    }>;
  };
  status: 'draft' | 'processing' | 'ready' | 'sent' | 'viewed';
  sentAt?: Date;
  viewedAt?: Date;
  pdfUrl?: string;
}
