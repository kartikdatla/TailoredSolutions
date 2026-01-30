// ==================================================
// Admin API Routes
// ==================================================
// Protected routes for business owner/admin

import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import {
  Client,
  Service,
  Portfolio,
  Booking,
  Consultation,
  Project,
  AvailabilitySlot,
  ConsultationBooking,
  ConsultationDocument,
} from '@home-improvements/db/schemas';
import { whisperService } from '../services/whisper.service';
import { teamsService } from '../services/teams.service';
import { documentGeneratorService } from '../services/document-generator.service';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication to all admin routes
router.use(authMiddleware);
router.use(adminOnly);

// ----- Validation Schemas -----

const clientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    postcode: z.string(),
    country: z.string().default('United Kingdom'),
  }).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const serviceSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  name: z.string().min(3),
  category: z.enum(['electrical', 'carpentry', 'home-improvement']),
  shortDescription: z.string().min(20),
  fullDescription: z.string().min(50),
  features: z.array(z.string()),
  priceRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    unit: z.enum(['fixed', 'hourly', 'per-sqft']),
  }).optional(),
  images: z.array(z.string().url()).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().default(true),
});

const consultationSchema = z.object({
  clientId: z.string(),
  bookingId: z.string().optional(),
  meetingDetails: z.object({
    platform: z.enum(['teams', 'whatsapp', 'phone', 'in-person']),
    scheduledAt: z.string().datetime(),
    duration: z.number().positive().optional(),
  }),
});

// =============================================
// CLIENT ROUTES
// =============================================

/**
 * GET /api/admin/clients
 * List all clients with pagination
 */
router.get('/clients', async (req, res, next) => {
  try {
    const { search, tag, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { 'name.first': { $regex: search, $options: 'i' } },
        { 'name.last': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      filter.tags = tag;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: Record<string, 1 | -1> = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    const [clients, total] = await Promise.all([
      Client.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Client.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: clients,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/clients
 * Create a new client
 */
router.post('/clients', async (req, res, next) => {
  try {
    const validatedData = clientSchema.parse(req.body);

    const client = new Client({
      email: validatedData.email,
      phone: validatedData.phone,
      name: {
        first: validatedData.firstName,
        last: validatedData.lastName,
      },
      preferredContactMethod: validatedData.preferredContactMethod,
      address: validatedData.address,
      notes: validatedData.notes || '',
      tags: validatedData.tags || [],
    });

    await client.save();

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors },
      });
    }
    next(error);
  }
});

/**
 * GET /api/admin/clients/:id
 * Get client details with related data
 */
router.get('/clients/:id', async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('projects')
      .populate('consultations')
      .lean();

    if (!client) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Client not found' },
      });
    }

    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/clients/:id
 * Update client
 */
router.put('/clients/:id', async (req, res, next) => {
  try {
    const validatedData = clientSchema.partial().parse(req.body);

    const updateData: Record<string, any> = {};
    if (validatedData.firstName || validatedData.lastName) {
      updateData.name = {};
      if (validatedData.firstName) updateData.name.first = validatedData.firstName;
      if (validatedData.lastName) updateData.name.last = validatedData.lastName;
    }
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.phone) updateData.phone = validatedData.phone;
    if (validatedData.preferredContactMethod) updateData.preferredContactMethod = validatedData.preferredContactMethod;
    if (validatedData.address) updateData.address = validatedData.address;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.tags) updateData.tags = validatedData.tags;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Client not found' },
      });
    }

    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/clients/:id
 * Delete client
 */
router.delete('/clients/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Client not found' },
      });
    }

    res.json({ success: true, data: { message: 'Client deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

// =============================================
// BOOKING ROUTES
// =============================================

/**
 * GET /api/admin/bookings
 * List all bookings
 */
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, urgency, page = 1, limit = 20 } = req.query;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('clientId', 'name email')
        .lean(),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/bookings/:id
 * Update booking status
 */
router.put('/bookings/:id', async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    if (status) {
      booking.status = status;
      booking.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: (req as any).user._id,
        notes: notes || undefined,
      });
    }

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/bookings/:id/convert
 * Convert booking to client and/or consultation
 */
router.post('/bookings/:id/convert', async (req, res, next) => {
  try {
    const { createClient = true, createConsultation = false, scheduledAt, platform = 'teams' } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    let client = null;

    // Create or find client
    if (createClient) {
      const existingClient = await Client.findOne({ email: booking.contactInfo.email });

      if (existingClient) {
        client = existingClient;
      } else {
        const nameParts = booking.contactInfo.name.split(' ');
        client = new Client({
          email: booking.contactInfo.email,
          phone: booking.contactInfo.phone,
          name: {
            first: nameParts[0] || booking.contactInfo.name,
            last: nameParts.slice(1).join(' ') || '',
          },
          preferredContactMethod: booking.preferredContactMethod,
          notes: `Created from booking: ${booking.service.description}`,
        });
        await client.save();
      }

      booking.clientId = client._id;
    }

    // Create consultation if requested
    let consultation = null;
    if (createConsultation && client && scheduledAt) {
      consultation = new Consultation({
        clientId: client._id,
        bookingId: booking._id,
        meetingDetails: {
          platform,
          scheduledAt: new Date(scheduledAt),
        },
      });

      // If Teams, create the meeting
      if (platform === 'teams') {
        const meeting = await teamsService.createMeeting({
          clientEmail: client.email,
          clientName: `${client.name.first} ${client.name.last}`,
          scheduledAt: new Date(scheduledAt),
          duration: 60, // 1 hour default
          subject: `Consultation: ${booking.service.category}`,
          description: booking.service.description,
        });

        consultation.meetingDetails.teamsEventId = meeting.meetingId;
      }

      await consultation.save();
      client.consultations.push(consultation._id);
      await client.save();

      booking.status = 'scheduled';
      booking.statusHistory.push({
        status: 'scheduled',
        changedAt: new Date(),
        notes: 'Consultation scheduled',
      });
    }

    await booking.save();

    res.json({
      success: true,
      data: {
        booking,
        client,
        consultation,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================
// CONSULTATION ROUTES
// =============================================

/**
 * GET /api/admin/consultations
 * List all consultations
 */
router.get('/consultations', async (req, res, next) => {
  try {
    const { clientId, status, page = 1, limit = 20 } = req.query;

    const filter: Record<string, any> = {};
    if (clientId) filter.clientId = new mongoose.Types.ObjectId(clientId as string);
    if (status) filter['document.status'] = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .sort({ 'meetingDetails.scheduledAt': -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('clientId', 'name email')
        .lean(),
      Consultation.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: consultations,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultations
 * Create a new consultation
 */
router.post('/consultations', async (req, res, next) => {
  try {
    const validatedData = consultationSchema.parse(req.body);

    const client = await Client.findById(validatedData.clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Client not found' },
      });
    }

    const consultation = new Consultation({
      clientId: validatedData.clientId,
      bookingId: validatedData.bookingId,
      meetingDetails: {
        platform: validatedData.meetingDetails.platform,
        scheduledAt: new Date(validatedData.meetingDetails.scheduledAt),
        duration: validatedData.meetingDetails.duration,
      },
    });

    // Create Teams meeting if platform is teams
    if (validatedData.meetingDetails.platform === 'teams') {
      const meeting = await teamsService.createMeeting({
        clientEmail: client.email,
        clientName: `${client.name.first} ${client.name.last}`,
        scheduledAt: new Date(validatedData.meetingDetails.scheduledAt),
        duration: validatedData.meetingDetails.duration || 60,
        subject: 'Consultation',
      });

      consultation.meetingDetails.teamsEventId = meeting.meetingId;
    }

    await consultation.save();

    // Link to client
    client.consultations.push(consultation._id);
    await client.save();

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultations/:id/transcribe
 * Trigger transcription for a consultation recording
 */
router.post('/consultations/:id/transcribe', async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Consultation not found' },
      });
    }

    const { recordingUrl } = req.body;

    if (!recordingUrl && !consultation.meetingDetails.recordingUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_RECORDING', message: 'No recording URL provided or available' },
      });
    }

    const audioUrl = recordingUrl || consultation.meetingDetails.recordingUrl;

    // Update status to processing
    consultation.transcription = {
      status: 'processing',
    };
    await consultation.save();

    // Process transcription (this could be async/background job in production)
    try {
      const result = await whisperService.processConsultationFromUrl(audioUrl);

      // Update consultation with transcription and summary
      consultation.transcription = {
        status: 'completed',
        rawText: result.transcription.text,
        processedAt: new Date(),
      };

      consultation.document = {
        title: result.summary.title,
        summary: result.summary.summary,
        keyPoints: result.summary.keyPoints,
        recommendations: result.summary.recommendations,
        nextSteps: result.summary.nextSteps,
        estimatedCost: result.summary.estimatedCost ? {
          min: result.summary.estimatedCost.min,
          max: result.summary.estimatedCost.max,
          notes: result.summary.estimatedCost.notes,
        } : undefined,
        attachments: [],
        status: 'draft',
      };

      await consultation.save();

      res.json({
        success: true,
        data: {
          message: 'Transcription completed',
          consultation,
        },
      });
    } catch (transcriptionError) {
      consultation.transcription = {
        status: 'failed',
      };
      await consultation.save();

      throw transcriptionError;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultations/:id/publish
 * Publish consultation document to client portal
 */
router.post('/consultations/:id/publish', async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Consultation not found' },
      });
    }

    if (!consultation.document) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_DOCUMENT', message: 'No document to publish' },
      });
    }

    consultation.document.status = 'published';
    consultation.document.publishedAt = new Date();
    await consultation.save();

    // TODO: Send notification to client

    res.json({
      success: true,
      data: {
        message: 'Document published successfully',
        consultation,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================
// SERVICES ROUTES
// =============================================

/**
 * GET /api/admin/services
 * List all services (including inactive)
 */
router.get('/services', async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1 }).lean();
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/services
 * Create a new service
 */
router.post('/services', async (req, res, next) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    const service = new Service(validatedData);
    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors },
      });
    }
    next(error);
  }
});

/**
 * PUT /api/admin/services/:id
 * Update service
 */
router.put('/services/:id', async (req, res, next) => {
  try {
    const validatedData = serviceSchema.partial().parse(req.body);
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found' },
      });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/services/:id
 * Delete service
 */
router.delete('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found' },
      });
    }
    res.json({ success: true, data: { message: 'Service deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

// =============================================
// PORTFOLIO ROUTES
// =============================================

/**
 * GET /api/admin/portfolio
 * List all portfolio items (including unpublished)
 */
router.get('/portfolio', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find().sort({ displayOrder: 1 }).lean();
    res.json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/portfolio
 * Create portfolio item
 */
router.post('/portfolio', async (req, res, next) => {
  try {
    const item = new Portfolio(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/portfolio/:id
 * Update portfolio item
 */
router.put('/portfolio/:id', async (req, res, next) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Portfolio item not found' },
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/portfolio/:id
 * Delete portfolio item
 */
router.delete('/portfolio/:id', async (req, res, next) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Portfolio item not found' },
      });
    }
    res.json({ success: true, data: { message: 'Portfolio item deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

// =============================================
// AVAILABILITY SLOTS ROUTES
// =============================================

/**
 * GET /api/admin/availability
 * Get availability slots for a date range
 */
router.get('/availability', async (req, res, next) => {
  try {
    const { startDate, endDate, includeBooked = 'true' } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate
      ? new Date(endDate as string)
      : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    const filter: Record<string, any> = {
      date: { $gte: start, $lte: end },
    };

    if (includeBooked === 'false') {
      filter.isBooked = false;
    }

    const slots = await AvailabilitySlot.find(filter)
      .sort({ date: 1, startTime: 1 })
      .populate('bookingId')
      .lean();

    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/availability
 * Create a new availability slot
 */
router.post('/availability', async (req, res, next) => {
  try {
    const { date, startTime, endTime, duration = 60, isRecurring, recurringRule } = req.body;

    const slot = new AvailabilitySlot({
      date: new Date(date),
      startTime,
      endTime,
      duration,
      isBooked: false,
      isRecurring: isRecurring || false,
      recurringRule,
      createdBy: (req as any).user._id,
    });

    await slot.save();

    // If recurring, create additional slots
    if (isRecurring && recurringRule) {
      const endDate = recurringRule.endDate ? new Date(recurringRule.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const daysOfWeek = recurringRule.daysOfWeek || [];
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + 7); // Start from next week

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (daysOfWeek.length === 0 || daysOfWeek.includes(dayOfWeek)) {
          const recurringSlot = new AvailabilitySlot({
            date: new Date(currentDate),
            startTime,
            endTime,
            duration,
            isBooked: false,
            isRecurring: true,
            recurringRule,
            createdBy: (req as any).user._id,
          });
          await recurringSlot.save();
        }

        currentDate.setDate(currentDate.getDate() + 7);
      }
    }

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/availability/:id
 * Update an availability slot
 */
router.put('/availability/:id', async (req, res, next) => {
  try {
    const { startTime, endTime, duration, blockedReason } = req.body;

    const slot = await AvailabilitySlot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Slot not found' },
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        error: { code: 'SLOT_BOOKED', message: 'Cannot modify a booked slot' },
      });
    }

    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (duration) slot.duration = duration;
    if (blockedReason !== undefined) slot.blockedReason = blockedReason;

    await slot.save();

    res.json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/availability/:id
 * Delete an availability slot
 */
router.delete('/availability/:id', async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Slot not found' },
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        error: { code: 'SLOT_BOOKED', message: 'Cannot delete a booked slot' },
      });
    }

    await slot.deleteOne();

    res.json({ success: true, data: { message: 'Slot deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/availability/bulk
 * Create multiple slots at once
 */
router.post('/availability/bulk', async (req, res, next) => {
  try {
    const { dates, times, duration = 60 } = req.body;

    const slots: any[] = [];

    for (const date of dates) {
      for (const time of times) {
        const [hours, minutes] = time.split(':').map(Number);
        const endHours = hours + Math.floor((minutes + duration) / 60);
        const endMinutes = (minutes + duration) % 60;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

        slots.push({
          date: new Date(date),
          startTime: time,
          endTime,
          duration,
          isBooked: false,
          isRecurring: false,
          createdBy: (req as any).user._id,
        });
      }
    }

    const created = await AvailabilitySlot.insertMany(slots);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// =============================================
// CONSULTATION BOOKINGS ROUTES
// =============================================

/**
 * GET /api/admin/consultation-bookings
 * List all consultation bookings
 */
router.get('/consultation-bookings', async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate as string);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      ConsultationBooking.find(filter)
        .sort({ scheduledDate: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('slotId')
        .lean(),
      ConsultationBooking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/consultation-bookings/:id
 * Get a specific consultation booking
 */
router.get('/consultation-bookings/:id', async (req, res, next) => {
  try {
    const booking = await ConsultationBooking.findById(req.params.id)
      .populate('slotId')
      .populate('consultationId')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/consultation-bookings/:id
 * Update consultation booking status
 */
router.put('/consultation-bookings/:id', async (req, res, next) => {
  try {
    const { status, notes, cancellationReason } = req.body;

    const booking = await ConsultationBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    // If cancelling, free up the slot
    if (status === 'cancelled') {
      await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
        isBooked: false,
        bookingId: null,
      });
    }

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultation-bookings/:id/confirm
 * Confirm a booking and create Teams meeting
 */
router.post('/consultation-bookings/:id/confirm', async (req, res, next) => {
  try {
    const booking = await ConsultationBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Booking is not pending' },
      });
    }

    // Create Teams meeting
    const meeting = await teamsService.createMeeting({
      clientEmail: booking.clientInfo.email,
      clientName: booking.clientInfo.name,
      scheduledAt: booking.scheduledDate,
      duration: booking.duration,
      subject: `Consultation: ${booking.serviceCategory}`,
      description: booking.projectDescription,
    });

    booking.status = 'confirmed';
    booking.meeting = {
      teamsJoinUrl: meeting.joinWebUrl,
      teamsMeetingId: meeting.meetingId,
    };

    await booking.save();

    // TODO: Send confirmation email to client with meeting link

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// =============================================
// CONSULTATION DOCUMENTS ROUTES
// =============================================

/**
 * GET /api/admin/consultation-documents
 * List all consultation documents
 */
router.get('/consultation-documents', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [documents, total] = await Promise.all([
      ConsultationDocument.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ConsultationDocument.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: documents,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/consultation-documents/:id
 * Get a specific consultation document
 */
router.get('/consultation-documents/:id', async (req, res, next) => {
  try {
    const document = await ConsultationDocument.findById(req.params.id)
      .populate('consultationId')
      .populate('bookingId')
      .lean();

    if (!document) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultation-documents/:id/generate
 * Generate document content from transcription
 */
router.post('/consultation-documents/:id/generate', async (req, res, next) => {
  try {
    const doc = await ConsultationDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    if (doc.transcription.status !== 'completed' || !doc.transcription.rawText) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_TRANSCRIPTION', message: 'Transcription not available' },
      });
    }

    doc.status = 'processing';
    await doc.save();

    try {
      // Get the booking for service category
      const booking = await ConsultationBooking.findById(doc.bookingId).lean();
      const serviceCategory = booking?.serviceCategory || 'general';

      // Generate the document
      const generatedDoc = await documentGeneratorService.generateDocument({
        consultationId: doc.consultationId.toString(),
        bookingId: doc.bookingId.toString(),
        clientInfo: doc.clientInfo,
        meetingInfo: doc.meetingInfo,
        transcription: {
          rawText: doc.transcription.rawText,
          segments: doc.transcription.segments,
        },
        serviceCategory: serviceCategory as any,
      });

      // Update document with generated content
      doc.document = generatedDoc.document;
      doc.status = 'ready';
      await doc.save();

      res.json({ success: true, data: doc });
    } catch (genError) {
      doc.status = 'draft';
      await doc.save();
      throw genError;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/consultation-documents/:id/html
 * Get HTML version of the document
 */
router.get('/consultation-documents/:id/html', async (req, res, next) => {
  try {
    const doc = await ConsultationDocument.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    if (doc.status !== 'ready' && doc.status !== 'sent' && doc.status !== 'viewed') {
      return res.status(400).json({
        success: false,
        error: { code: 'NOT_READY', message: 'Document is not ready' },
      });
    }

    const html = documentGeneratorService.generateHtmlDocument(doc as any);
    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/consultation-documents/:id/send
 * Send document to client
 */
router.post('/consultation-documents/:id/send', async (req, res, next) => {
  try {
    const doc = await ConsultationDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    if (doc.status !== 'ready') {
      return res.status(400).json({
        success: false,
        error: { code: 'NOT_READY', message: 'Document is not ready to send' },
      });
    }

    doc.status = 'sent';
    doc.sentAt = new Date();
    await doc.save();

    // TODO: Send email to client with document link

    res.json({ success: true, data: { message: 'Document sent successfully', document: doc } });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/consultation-documents/:id
 * Update document content manually
 */
router.put('/consultation-documents/:id', async (req, res, next) => {
  try {
    const { document: docContent } = req.body;

    const doc = await ConsultationDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    if (docContent) {
      doc.document = { ...doc.document, ...docContent };
    }

    await doc.save();

    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

export default router;
