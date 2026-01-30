// ==================================================
// Public API Routes
// ==================================================
// No authentication required

import { Router } from 'express';
import { z } from 'zod';
import { Service, Portfolio, Booking, AvailabilitySlot, ConsultationBooking, ConsultationDocument } from '@home-improvements/db/schemas';

const router = Router();

// ----- Validation Schemas -----

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
  serviceCategory: z.enum(['electrical', 'carpentry', 'home-improvement']),
  serviceDescription: z.string().min(10, 'Please describe your needs in detail'),
  propertyType: z.enum(['house', 'flat', 'commercial', 'other']),
  urgency: z.enum(['emergency', 'urgent', 'standard', 'flexible']),
  preferredDates: z.array(z.string()).optional(),
  preferredTimes: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

const consultationBookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  postcode: z.string().min(3, 'Please enter a valid postcode'),
  slotId: z.string(),
  serviceCategory: z.enum(['electrical', 'carpentry', 'home-improvement', 'general']),
  projectDescription: z.string().min(20, 'Please describe your project in detail'),
  urgency: z.enum(['flexible', 'standard', 'urgent', 'emergency']),
  propertyType: z.enum(['house', 'flat', 'commercial', 'other']),
});

// ----- Services Routes -----

/**
 * GET /api/public/services
 * List all active services
 */
router.get('/services', async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter: Record<string, any> = { isActive: true };
    if (category && ['electrical', 'carpentry', 'home-improvement'].includes(category as string)) {
      filter.category = category;
    }

    const services = await Service.find(filter)
      .select('-createdAt -updatedAt -__v')
      .sort({ displayOrder: 1 })
      .lean();

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/services/:slug
 * Get service details by slug
 */
router.get('/services/:slug', async (req, res, next) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate('relatedServices', 'slug name category shortDescription')
      .select('-createdAt -updatedAt -__v')
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found' },
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
});

// ----- Portfolio Routes -----

/**
 * GET /api/public/portfolio
 * List published portfolio items
 */
router.get('/portfolio', async (req, res, next) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;

    const filter: Record<string, any> = { isPublished: true };

    if (category && ['electrical', 'carpentry', 'home-improvement'].includes(category as string)) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Portfolio.find(filter)
        .select('-createdAt -updatedAt -__v')
        .sort({ displayOrder: 1, completionDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Portfolio.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
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
 * GET /api/public/portfolio/:slug
 * Get portfolio item details
 */
router.get('/portfolio/:slug', async (req, res, next) => {
  try {
    const item = await Portfolio.findOne({
      slug: req.params.slug,
      isPublished: true,
    })
      .select('-createdAt -updatedAt -__v')
      .lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Portfolio item not found' },
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// ----- Testimonials Route -----

/**
 * GET /api/public/testimonials
 * List approved testimonials from portfolio items
 */
router.get('/testimonials', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const portfolioWithTestimonials = await Portfolio.find({
      isPublished: true,
      testimonial: { $exists: true, $ne: null },
    })
      .select('title category testimonial completionDate')
      .sort({ completionDate: -1 })
      .limit(Number(limit))
      .lean();

    const testimonials = portfolioWithTestimonials.map((item) => ({
      projectTitle: item.title,
      category: item.category,
      quote: item.testimonial?.quote,
      clientName: item.testimonial?.clientName,
      clientInitials: item.testimonial?.clientInitials,
      date: item.completionDate,
    }));

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

// ----- Booking Routes -----

/**
 * POST /api/public/bookings
 * Submit a new booking request
 */
router.post('/bookings', async (req, res, next) => {
  try {
    // Validate input
    const validatedData = bookingSchema.parse(req.body);

    // Create booking
    const booking = new Booking({
      contactInfo: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
      },
      service: {
        category: validatedData.serviceCategory,
        description: validatedData.serviceDescription,
      },
      property: {
        type: validatedData.propertyType,
      },
      urgency: validatedData.urgency,
      preferredContactMethod: validatedData.preferredContactMethod,
      preferredDates: validatedData.preferredDates?.map((d) => new Date(d)) || [],
      preferredTimes: validatedData.preferredTimes || [],
      notes: validatedData.notes || '',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date(),
          notes: 'Booking submitted via website',
        },
      ],
    });

    await booking.save();

    // TODO: Send confirmation email/SMS/WhatsApp
    // TODO: Send notification to business owner

    res.status(201).json({
      success: true,
      data: {
        id: booking._id,
        message: 'Booking request submitted successfully. We will contact you soon.',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
});

// ----- Contact Routes -----

/**
 * POST /api/public/contact
 * Submit a contact form message
 */
router.post('/contact', async (req, res, next) => {
  try {
    // Validate input
    const validatedData = contactSchema.parse(req.body);

    // TODO: Store contact submission in database
    // TODO: Send email notification to business owner
    // TODO: Send auto-reply to sender

    // For now, just acknowledge receipt
    console.log('Contact form submission:', validatedData);

    res.status(200).json({
      success: true,
      data: {
        message: 'Thank you for your message. We will get back to you soon.',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
});

// =============================================
// CONSULTATION BOOKING ROUTES
// =============================================

/**
 * GET /api/public/consultation-slots
 * Get available consultation slots for booking
 */
router.get('/consultation-slots', async (req, res, next) => {
  try {
    const { startDate, endDate, duration } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = endDate
      ? new Date(endDate as string)
      : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    const filter: Record<string, any> = {
      date: { $gte: start, $lte: end },
      isBooked: false,
      blockedReason: { $exists: false },
    };

    if (duration) {
      filter.duration = Number(duration);
    }

    const slots = await AvailabilitySlot.find(filter)
      .select('date startTime endTime duration')
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Group slots by date for easier frontend consumption
    const groupedSlots: Record<string, any[]> = {};
    slots.forEach((slot) => {
      const dateKey = new Date(slot.date).toISOString().split('T')[0];
      if (!groupedSlots[dateKey]) {
        groupedSlots[dateKey] = [];
      }
      groupedSlots[dateKey].push({
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: slot.duration,
      });
    });

    res.json({
      success: true,
      data: {
        slots: groupedSlots,
        availableDates: Object.keys(groupedSlots).sort(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/public/consultation-bookings
 * Book a consultation slot
 */
router.post('/consultation-bookings', async (req, res, next) => {
  try {
    const validatedData = consultationBookingSchema.parse(req.body);

    // Check if slot is still available
    const slot = await AvailabilitySlot.findById(validatedData.slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        error: { code: 'SLOT_NOT_FOUND', message: 'Consultation slot not found' },
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        error: { code: 'SLOT_UNAVAILABLE', message: 'This slot has already been booked' },
      });
    }

    // Create the consultation booking
    const booking = new ConsultationBooking({
      clientInfo: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        postcode: validatedData.postcode,
      },
      slotId: slot._id,
      scheduledDate: slot.date,
      scheduledTime: slot.startTime,
      duration: slot.duration,
      serviceCategory: validatedData.serviceCategory,
      projectDescription: validatedData.projectDescription,
      urgency: validatedData.urgency,
      propertyType: validatedData.propertyType,
      status: 'pending',
      remindersSent: [],
      notes: '',
    });

    await booking.save();

    // Mark slot as booked
    slot.isBooked = true;
    slot.bookingId = booking._id;
    await slot.save();

    // TODO: Send confirmation email to client
    // TODO: Notify business owner of new booking

    res.status(201).json({
      success: true,
      data: {
        id: booking._id,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        duration: booking.duration,
        message: 'Your consultation has been booked. You will receive a confirmation email with meeting details.',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
});

/**
 * GET /api/public/consultation-bookings/:id
 * Get booking details (limited info for client)
 */
router.get('/consultation-bookings/:id', async (req, res, next) => {
  try {
    const booking = await ConsultationBooking.findById(req.params.id)
      .select('clientInfo.name scheduledDate scheduledTime duration serviceCategory status meeting.teamsJoinUrl')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    res.json({
      success: true,
      data: {
        clientName: booking.clientInfo.name,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        duration: booking.duration,
        serviceCategory: booking.serviceCategory,
        status: booking.status,
        meetingLink: booking.status === 'confirmed' ? booking.meeting?.teamsJoinUrl : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/public/consultation-bookings/:id/cancel
 * Cancel a booking (before confirmation)
 */
router.post('/consultation-bookings/:id/cancel', async (req, res, next) => {
  try {
    const { email, reason } = req.body;

    const booking = await ConsultationBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found' },
      });
    }

    // Verify email matches
    if (booking.clientInfo.email.toLowerCase() !== email?.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Email does not match booking' },
      });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Cannot cancel this booking' },
      });
    }

    // Cancel booking
    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by client';
    await booking.save();

    // Free up the slot
    await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
      isBooked: false,
      bookingId: null,
    });

    res.json({
      success: true,
      data: { message: 'Booking cancelled successfully' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/consultation-documents/:id
 * View consultation document (client access)
 */
router.get('/consultation-documents/:id', async (req, res, next) => {
  try {
    const { token } = req.query;

    const doc = await ConsultationDocument.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    // Only allow viewing if document has been sent
    if (doc.status !== 'sent' && doc.status !== 'viewed') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Document not available' },
      });
    }

    // TODO: Verify access token if provided

    // Mark as viewed
    if (doc.status === 'sent') {
      await ConsultationDocument.findByIdAndUpdate(doc._id, {
        status: 'viewed',
        viewedAt: new Date(),
      });
    }

    // Return document without internal fields
    res.json({
      success: true,
      data: {
        clientInfo: doc.clientInfo,
        meetingInfo: {
          date: doc.meetingInfo.date,
          duration: doc.meetingInfo.duration,
        },
        document: doc.document,
        pdfUrl: doc.pdfUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
