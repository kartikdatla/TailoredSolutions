// ==================================================
// Client Portal API Routes
// ==================================================
// Authenticated routes for clients

import { Router } from 'express';
import { Client, Consultation, Project } from '@home-improvements/db/schemas';
import { clientAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply client authentication to all routes
router.use(clientAuthMiddleware);

// ----- Profile Routes -----

/**
 * GET /api/client/profile
 * Get client's own profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const client = await Client.findById(clientId)
      .select('-__v')
      .lean();

    if (!client) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Profile not found' },
      });
    }

    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/client/profile
 * Update client's own profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;
    const { phone, preferredContactMethod, address } = req.body;

    const updateData: Record<string, any> = {};
    if (phone) updateData.phone = phone;
    if (preferredContactMethod) updateData.preferredContactMethod = preferredContactMethod;
    if (address) updateData.address = address;

    const client = await Client.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// ----- Consultations Routes -----

/**
 * GET /api/client/consultations
 * List client's consultations
 */
router.get('/consultations', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const consultations = await Consultation.find({
      clientId,
      'document.status': 'published', // Only show published documents
    })
      .select('meetingDetails.scheduledAt meetingDetails.platform document.title document.publishedAt')
      .sort({ 'meetingDetails.scheduledAt': -1 })
      .lean();

    res.json({ success: true, data: consultations });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/consultations/:id
 * Get consultation details with document
 */
router.get('/consultations/:id', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const consultation = await Consultation.findOne({
      _id: req.params.id,
      clientId,
    })
      .select('-transcription.rawText -__v') // Don't expose raw transcription to client
      .lean();

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Consultation not found' },
      });
    }

    // Only return document if published
    if (consultation.document?.status !== 'published') {
      consultation.document = undefined;
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
});

// ----- Documents Routes -----

/**
 * GET /api/client/documents
 * List all published documents for the client
 */
router.get('/documents', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const consultations = await Consultation.find({
      clientId,
      'document.status': 'published',
    })
      .select('document.title document.summary document.publishedAt meetingDetails.scheduledAt')
      .sort({ 'document.publishedAt': -1 })
      .lean();

    const documents = consultations.map((c) => ({
      id: c._id,
      title: c.document?.title,
      summary: c.document?.summary,
      publishedAt: c.document?.publishedAt,
      consultationDate: c.meetingDetails.scheduledAt,
    }));

    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/documents/:id
 * Get full document details
 */
router.get('/documents/:id', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const consultation = await Consultation.findOne({
      _id: req.params.id,
      clientId,
      'document.status': 'published',
    })
      .select('document meetingDetails.scheduledAt')
      .lean();

    if (!consultation || !consultation.document) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    res.json({
      success: true,
      data: {
        id: consultation._id,
        consultationDate: consultation.meetingDetails.scheduledAt,
        ...consultation.document,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ----- Projects Routes -----

/**
 * GET /api/client/projects
 * List client's projects
 */
router.get('/projects', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const projects = await Project.find({ clientId })
      .select('title category status timeline.estimatedCompletion timeline.actualCompletion createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/client/projects/:id
 * Get project details with public updates
 */
router.get('/projects/:id', async (req, res, next) => {
  try {
    const clientId = (req as any).client._id;

    const project = await Project.findOne({
      _id: req.params.id,
      clientId,
    })
      .select('-pricing.invoices -__v')
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Project not found' },
      });
    }

    // Filter to only public updates
    if (project.updates) {
      project.updates = project.updates.filter((u) => u.isPublic);
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

export default router;
