// ==================================================
// MongoDB Schemas for Home Improvements Business
// ==================================================

import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  ServiceCategory,
  ContactMethod,
  PropertyType,
  BookingUrgency,
  BookingStatus,
  ProjectStatus,
  DocumentStatus,
  MeetingPlatform,
  TranscriptionStatus,
  AttachmentType,
  UserRole,
} from '@home-improvements/shared';

// ----- Client Schema -----

export interface IClient extends Document {
  email: string;
  phone: string;
  name: {
    first: string;
    last: string;
  };
  preferredContactMethod: ContactMethod;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  projects: mongoose.Types.ObjectId[];
  consultations: mongoose.Types.ObjectId[];
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    name: {
      first: { type: String, required: true, trim: true },
      last: { type: String, required: true, trim: true },
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },
    address: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      postcode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'United Kingdom' },
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    consultations: [{ type: Schema.Types.ObjectId, ref: 'Consultation' }],
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

ClientSchema.index({ email: 1 });
ClientSchema.index({ 'name.first': 1, 'name.last': 1 });
ClientSchema.index({ tags: 1 });

// ----- Service Schema -----

export interface IService extends Document {
  slug: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  priceRange?: {
    min: number;
    max: number;
    unit: 'fixed' | 'hourly' | 'per-sqft';
  };
  images: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedServices: mongoose.Types.ObjectId[];
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['electrical', 'carpentry', 'home-improvement'],
      required: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true },
    features: [{ type: String, trim: true }],
    priceRange: {
      min: { type: Number },
      max: { type: Number },
      unit: { type: String, enum: ['fixed', 'hourly', 'per-sqft'] },
    },
    images: [{ type: String }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    relatedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ displayOrder: 1 });

// ----- Booking Schema -----

export interface IBooking extends Document {
  clientId?: mongoose.Types.ObjectId;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    category: ServiceCategory;
    description: string;
  };
  property: {
    type: PropertyType;
    location?: string;
  };
  urgency: BookingUrgency;
  preferredDates: Date[];
  preferredTimes: string[];
  preferredContactMethod: ContactMethod;
  images: string[];
  notes: string;
  status: BookingStatus;
  statusHistory: Array<{
    status: BookingStatus;
    changedAt: Date;
    changedBy?: mongoose.Types.ObjectId;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    contactInfo: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    service: {
      category: {
        type: String,
        enum: ['electrical', 'carpentry', 'home-improvement'],
        required: true,
      },
      description: { type: String, required: true },
    },
    property: {
      type: { type: String, enum: ['house', 'flat', 'commercial', 'other'], required: true },
      location: { type: String, trim: true },
    },
    urgency: {
      type: String,
      enum: ['emergency', 'urgent', 'standard', 'flexible'],
      default: 'standard',
    },
    preferredDates: [{ type: Date }],
    preferredTimes: [{ type: String }],
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },
    images: [{ type: String }],
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ 'contactInfo.email': 1 });
BookingSchema.index({ urgency: 1, status: 1 });

// ----- Consultation Schema -----

export interface IConsultation extends Document {
  clientId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  meetingDetails: {
    platform: MeetingPlatform;
    scheduledAt: Date;
    duration?: number;
    recordingUrl?: string;
    teamsEventId?: string;
  };
  transcription?: {
    status: TranscriptionStatus;
    rawText?: string;
    processedAt?: Date;
    whisperJobId?: string;
  };
  document?: {
    title: string;
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    nextSteps: string[];
    estimatedCost?: {
      min: number;
      max: number;
      breakdown?: Array<{ item: string; cost: number }>;
      notes?: string;
    };
    attachments: Array<{
      type: AttachmentType;
      url: string;
      caption?: string;
      uploadedBy: 'client' | 'business';
    }>;
    status: DocumentStatus;
    publishedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    meetingDetails: {
      platform: {
        type: String,
        enum: ['teams', 'whatsapp', 'phone', 'in-person'],
        required: true,
      },
      scheduledAt: { type: Date, required: true },
      duration: { type: Number },
      recordingUrl: { type: String },
      teamsEventId: { type: String },
    },
    transcription: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
      },
      rawText: { type: String },
      processedAt: { type: Date },
      whisperJobId: { type: String },
    },
    document: {
      title: { type: String },
      summary: { type: String },
      keyPoints: [{ type: String }],
      recommendations: [{ type: String }],
      nextSteps: [{ type: String }],
      estimatedCost: {
        min: { type: Number },
        max: { type: Number },
        breakdown: [
          {
            item: { type: String },
            cost: { type: Number },
          },
        ],
        notes: { type: String },
      },
      attachments: [
        {
          type: { type: String, enum: ['client-image', 'example-work', 'diagram', 'quote-pdf'] },
          url: { type: String },
          caption: { type: String },
          uploadedBy: { type: String, enum: ['client', 'business'] },
        },
      ],
      status: {
        type: String,
        enum: ['draft', 'pending-review', 'published', 'archived'],
        default: 'draft',
      },
      publishedAt: { type: Date },
    },
  },
  { timestamps: true }
);

ConsultationSchema.index({ clientId: 1, createdAt: -1 });
ConsultationSchema.index({ 'meetingDetails.scheduledAt': 1 });
ConsultationSchema.index({ 'document.status': 1 });

// ----- Project Schema -----

export interface IProject extends Document {
  clientId: mongoose.Types.ObjectId;
  consultationId?: mongoose.Types.ObjectId;
  title: string;
  category: ServiceCategory;
  subcategory: string;
  description: string;
  status: ProjectStatus;
  timeline: {
    estimatedStart?: Date;
    actualStart?: Date;
    estimatedCompletion?: Date;
    actualCompletion?: Date;
  };
  pricing: {
    quoted: number;
    final?: number;
    invoices: mongoose.Types.ObjectId[];
  };
  updates: Array<{
    date: Date;
    content: string;
    images?: string[];
    isPublic: boolean;
  }>;
  portfolio?: {
    isPublished: boolean;
    publishedAt?: Date;
    images: Array<{
      url: string;
      caption?: string;
      isBefore: boolean;
      isAfter: boolean;
      isFeatured: boolean;
    }>;
    testimonial?: {
      quote: string;
      clientName: string;
      clientInitials?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['electrical', 'carpentry', 'home-improvement'],
      required: true,
    },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['quoted', 'approved', 'in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'quoted',
    },
    timeline: {
      estimatedStart: { type: Date },
      actualStart: { type: Date },
      estimatedCompletion: { type: Date },
      actualCompletion: { type: Date },
    },
    pricing: {
      quoted: { type: Number, required: true },
      final: { type: Number },
      invoices: [{ type: Schema.Types.ObjectId }],
    },
    updates: [
      {
        date: { type: Date, default: Date.now },
        content: { type: String, required: true },
        images: [{ type: String }],
        isPublic: { type: Boolean, default: false },
      },
    ],
    portfolio: {
      isPublished: { type: Boolean, default: false },
      publishedAt: { type: Date },
      images: [
        {
          url: { type: String },
          caption: { type: String },
          isBefore: { type: Boolean, default: false },
          isAfter: { type: Boolean, default: false },
          isFeatured: { type: Boolean, default: false },
        },
      ],
      testimonial: {
        quote: { type: String },
        clientName: { type: String },
        clientInitials: { type: String },
      },
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ clientId: 1, createdAt: -1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ 'portfolio.isPublished': 1 });

// ----- Portfolio Schema (standalone for public display) -----

export interface IPortfolio extends Document {
  projectId?: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  category: ServiceCategory;
  subcategory: string;
  description: string;
  scope: string;
  duration: string;
  completionDate: Date;
  location: string;
  images: Array<{
    url: string;
    caption?: string;
    isBefore: boolean;
    isAfter: boolean;
    isFeatured: boolean;
  }>;
  testimonial?: {
    quote: string;
    clientName: string;
    clientInitials?: string;
  };
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['electrical', 'carpentry', 'home-improvement'],
      required: true,
    },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true },
    scope: { type: String, trim: true },
    duration: { type: String, trim: true },
    completionDate: { type: Date },
    location: { type: String, trim: true },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        isBefore: { type: Boolean, default: false },
        isAfter: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
      },
    ],
    testimonial: {
      quote: { type: String },
      clientName: { type: String },
      clientInitials: { type: String },
    },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ category: 1, isPublished: 1 });
PortfolioSchema.index({ isFeatured: 1, isPublished: 1 });
PortfolioSchema.index({ tags: 1 });
PortfolioSchema.index({ displayOrder: 1 });

// ----- Calendar Availability Schema -----

export interface IAvailabilitySlot extends Document {
  date: Date;
  startTime: string; // HH:mm format
  endTime: string;
  duration: number; // in minutes (30, 45, 60)
  isBooked: boolean;
  bookingId?: mongoose.Types.ObjectId;
  consultationId?: mongoose.Types.ObjectId;
  isRecurring: boolean;
  recurringRule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[]; // 0-6, Sunday = 0
    endDate?: Date;
  };
  blockedReason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, default: 60 },
    isBooked: { type: Boolean, default: false },
    bookingId: { type: Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    isRecurring: { type: Boolean, default: false },
    recurringRule: {
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      interval: { type: Number, default: 1 },
      daysOfWeek: [{ type: Number }],
      endDate: { type: Date },
    },
    blockedReason: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AvailabilitySlotSchema.index({ date: 1, startTime: 1 });
AvailabilitySlotSchema.index({ isBooked: 1, date: 1 });

// ----- Consultation Booking Schema -----

export interface IConsultationBooking extends Document {
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    postcode: string;
  };
  slotId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  serviceCategory: 'electrical' | 'carpentry' | 'home-improvement' | 'general';
  projectDescription: string;
  urgency: 'flexible' | 'standard' | 'urgent' | 'emergency';
  propertyType: 'house' | 'flat' | 'commercial' | 'other';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  meeting: {
    teamsJoinUrl?: string;
    teamsMeetingId?: string;
    teamsThreadId?: string;
    clientAccessToken?: string; // Token for client to join without Teams account
  };
  consultationId?: mongoose.Types.ObjectId;
  remindersSent: Array<{
    type: 'email' | 'sms' | 'whatsapp';
    sentAt: Date;
    timeBefore: string; // '24h', '1h', '15m'
  }>;
  cancellationReason?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationBookingSchema = new Schema<IConsultationBooking>(
  {
    clientInfo: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      postcode: { type: String, required: true, trim: true },
    },
    slotId: { type: Schema.Types.ObjectId, ref: 'AvailabilitySlot', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    duration: { type: Number, default: 60 },
    serviceCategory: {
      type: String,
      enum: ['electrical', 'carpentry', 'home-improvement', 'general'],
      required: true,
    },
    projectDescription: { type: String, required: true },
    urgency: {
      type: String,
      enum: ['flexible', 'standard', 'urgent', 'emergency'],
      default: 'standard',
    },
    propertyType: {
      type: String,
      enum: ['house', 'flat', 'commercial', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    meeting: {
      teamsJoinUrl: { type: String },
      teamsMeetingId: { type: String },
      teamsThreadId: { type: String },
      clientAccessToken: { type: String },
    },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    remindersSent: [
      {
        type: { type: String, enum: ['email', 'sms', 'whatsapp'] },
        sentAt: { type: Date },
        timeBefore: { type: String },
      },
    ],
    cancellationReason: { type: String },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

ConsultationBookingSchema.index({ scheduledDate: 1, status: 1 });
ConsultationBookingSchema.index({ 'clientInfo.email': 1 });
ConsultationBookingSchema.index({ status: 1, scheduledDate: 1 });

// ----- Consultation Document Template Schema -----

export interface IConsultationDocument extends Document {
  consultationId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
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
    status: 'pending' | 'processing' | 'completed' | 'failed';
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
    // Executive Summary - easy for layperson
    executiveSummary: {
      projectOverview: string; // Plain English summary
      mainObjectives: string[];
      estimatedTimeline: string;
      budgetRange: {
        min: number;
        max: number;
        currency: string;
      };
    };
    // Technical Assessment - expert level
    technicalAssessment: {
      currentCondition: string;
      workRequired: Array<{
        area: string;
        description: string;
        technicalDetails: string; // Expert terminology
        laymanExplanation: string; // Plain English
        priority: 'essential' | 'recommended' | 'optional';
        estimatedCost: {
          min: number;
          max: number;
        };
      }>;
      complianceNotes: string[]; // Building regs, Part P, etc.
      safetyConsiderations: string[];
    };
    // Detailed Breakdown
    scopeOfWork: Array<{
      phase: number;
      title: string;
      tasks: Array<{
        task: string;
        details: string;
        materials?: string[];
        labourHours?: number;
      }>;
      estimatedDuration: string;
      costBreakdown: {
        labour: number;
        materials: number;
        total: number;
      };
    }>;
    // Materials & Specifications
    materialsSpecification: Array<{
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
    }>;
    // Recommendations
    recommendations: Array<{
      title: string;
      description: string;
      reasoning: string;
      impact: 'high' | 'medium' | 'low';
      costImplication: 'increase' | 'decrease' | 'neutral';
    }>;
    // Next Steps
    nextSteps: Array<{
      step: number;
      action: string;
      owner: 'client' | 'contractor';
      deadline?: string;
      notes?: string;
    }>;
    // Terms & Conditions
    termsAndConditions: {
      paymentTerms: string;
      warranty: string;
      cancellationPolicy: string;
      insuranceInfo: string;
    };
    // Appendices
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
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationDocumentSchema = new Schema<IConsultationDocument>(
  {
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'ConsultationBooking', required: true },
    clientInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      propertyType: { type: String },
      location: { type: String },
    },
    meetingInfo: {
      date: { type: Date, required: true },
      duration: { type: Number },
      recordingUrl: { type: String },
    },
    transcription: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },
      rawText: { type: String },
      segments: [
        {
          speaker: { type: String, enum: ['client', 'consultant', 'agent'] },
          text: { type: String },
          timestamp: { type: Number },
          confidence: { type: Number },
        },
      ],
      processedAt: { type: Date },
      whisperJobId: { type: String },
    },
    document: {
      executiveSummary: {
        projectOverview: { type: String },
        mainObjectives: [{ type: String }],
        estimatedTimeline: { type: String },
        budgetRange: {
          min: { type: Number },
          max: { type: Number },
          currency: { type: String, default: 'GBP' },
        },
      },
      technicalAssessment: {
        currentCondition: { type: String },
        workRequired: [
          {
            area: { type: String },
            description: { type: String },
            technicalDetails: { type: String },
            laymanExplanation: { type: String },
            priority: { type: String, enum: ['essential', 'recommended', 'optional'] },
            estimatedCost: {
              min: { type: Number },
              max: { type: Number },
            },
          },
        ],
        complianceNotes: [{ type: String }],
        safetyConsiderations: [{ type: String }],
      },
      scopeOfWork: [
        {
          phase: { type: Number },
          title: { type: String },
          tasks: [
            {
              task: { type: String },
              details: { type: String },
              materials: [{ type: String }],
              labourHours: { type: Number },
            },
          ],
          estimatedDuration: { type: String },
          costBreakdown: {
            labour: { type: Number },
            materials: { type: Number },
            total: { type: Number },
          },
        },
      ],
      materialsSpecification: [
        {
          item: { type: String },
          specification: { type: String },
          alternatives: [
            {
              item: { type: String },
              costDifference: { type: Number },
              notes: { type: String },
            },
          ],
          quantity: { type: String },
          unitCost: { type: Number },
          totalCost: { type: Number },
        },
      ],
      recommendations: [
        {
          title: { type: String },
          description: { type: String },
          reasoning: { type: String },
          impact: { type: String, enum: ['high', 'medium', 'low'] },
          costImplication: { type: String, enum: ['increase', 'decrease', 'neutral'] },
        },
      ],
      nextSteps: [
        {
          step: { type: Number },
          action: { type: String },
          owner: { type: String, enum: ['client', 'contractor'] },
          deadline: { type: String },
          notes: { type: String },
        },
      ],
      termsAndConditions: {
        paymentTerms: { type: String },
        warranty: { type: String },
        cancellationPolicy: { type: String },
        insuranceInfo: { type: String },
      },
      appendices: [
        {
          title: { type: String },
          type: { type: String, enum: ['diagram', 'photo', 'specification', 'certification'] },
          url: { type: String },
          content: { type: String },
        },
      ],
    },
    status: {
      type: String,
      enum: ['draft', 'processing', 'ready', 'sent', 'viewed'],
      default: 'draft',
    },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

ConsultationDocumentSchema.index({ consultationId: 1 });
ConsultationDocumentSchema.index({ bookingId: 1 });
ConsultationDocumentSchema.index({ status: 1 });

// ----- User Schema -----

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  permissions: string[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'owner'], default: 'owner' },
    permissions: [{ type: String }],
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

// ----- Model Exports -----

export const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export const Consultation: Model<IConsultation> =
  mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const AvailabilitySlot: Model<IAvailabilitySlot> =
  mongoose.models.AvailabilitySlot || mongoose.model<IAvailabilitySlot>('AvailabilitySlot', AvailabilitySlotSchema);

export const ConsultationBooking: Model<IConsultationBooking> =
  mongoose.models.ConsultationBooking || mongoose.model<IConsultationBooking>('ConsultationBooking', ConsultationBookingSchema);

export const ConsultationDocument: Model<IConsultationDocument> =
  mongoose.models.ConsultationDocument || mongoose.model<IConsultationDocument>('ConsultationDocument', ConsultationDocumentSchema);
