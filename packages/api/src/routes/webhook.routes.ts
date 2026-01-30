// ==================================================
// Webhook Routes
// ==================================================
// Handle incoming webhooks from external services

import { Router } from 'express';
import crypto from 'crypto';
import { Consultation } from '@home-improvements/db/schemas';
import { whisperService } from '../services/whisper.service';
import { teamsService } from '../services/teams.service';

const router = Router();

// ----- Helper Functions -----

/**
 * Verify Twilio webhook signature
 */
function verifyTwilioSignature(req: any): boolean {
  const twilioSignature = req.headers['x-twilio-signature'];
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!twilioSignature || !authToken) return false;

  // Build the full URL
  const url = `${process.env.API_URL}${req.originalUrl}`;

  // Sort the POST params and create the data string
  const data = Object.keys(req.body)
    .sort()
    .reduce((acc, key) => acc + key + req.body[key], url);

  // Calculate the signature
  const calculatedSignature = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');

  return twilioSignature === calculatedSignature;
}

// ----- Microsoft Teams Webhook -----

/**
 * POST /api/webhooks/teams
 * Handle Teams meeting events (recording available, meeting ended, etc.)
 */
router.post('/teams', async (req, res, next) => {
  try {
    // Microsoft sends a validation request first
    if (req.query.validationToken) {
      return res.status(200).send(req.query.validationToken);
    }

    const { value: notifications } = req.body;

    if (!notifications || !Array.isArray(notifications)) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    for (const notification of notifications) {
      const { resourceData, changeType, clientState } = notification;

      // Extract meeting ID from clientState
      const meetingId = clientState?.replace('meeting-', '');
      if (!meetingId) continue;

      // Find the consultation
      const consultation = await Consultation.findOne({
        'meetingDetails.teamsEventId': meetingId,
      });

      if (!consultation) continue;

      // Handle different notification types
      if (changeType === 'updated') {
        // Check if recording is now available
        try {
          const recordings = await teamsService.getMeetingRecordings(meetingId);

          if (recordings.length > 0) {
            // Update consultation with recording URL
            consultation.meetingDetails.recordingUrl = recordings[0].recordingUrl;
            consultation.meetingDetails.duration = recordings[0].duration;

            // Trigger transcription automatically if recording is available
            consultation.transcription = { status: 'pending' };
            await consultation.save();

            // Process transcription asynchronously
            processTranscriptionAsync(consultation._id.toString(), recordings[0].recordingUrl);
          }
        } catch (error) {
          console.error('Failed to fetch recordings:', error);
        }
      }
    }

    res.status(202).json({ status: 'accepted' });
  } catch (error) {
    next(error);
  }
});

/**
 * Async transcription processing
 */
async function processTranscriptionAsync(consultationId: string, recordingUrl: string) {
  try {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return;

    consultation.transcription = { status: 'processing' };
    await consultation.save();

    const result = await whisperService.processConsultationFromUrl(recordingUrl);

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
      status: 'pending-review',
    };

    await consultation.save();

    // TODO: Send notification to admin that transcription is ready for review
    console.log(`Transcription completed for consultation ${consultationId}`);
  } catch (error) {
    console.error(`Transcription failed for consultation ${consultationId}:`, error);

    const consultation = await Consultation.findById(consultationId);
    if (consultation) {
      consultation.transcription = { status: 'failed' };
      await consultation.save();
    }
  }
}

// ----- Twilio Webhook (WhatsApp/SMS) -----

/**
 * POST /api/webhooks/twilio
 * Handle incoming WhatsApp/SMS messages
 */
router.post('/twilio', async (req, res, next) => {
  try {
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      if (!verifyTwilioSignature(req)) {
        return res.status(403).json({ error: 'Invalid signature' });
      }
    }

    const {
      From: from,
      To: to,
      Body: body,
      MessageSid: messageSid,
      NumMedia: numMedia,
      MediaUrl0: mediaUrl,
    } = req.body;

    console.log('Incoming message:', {
      from,
      to,
      body: body?.substring(0, 100),
      hasMedia: Number(numMedia) > 0,
    });

    // TODO: Implement message handling logic
    // - Match to existing client by phone number
    // - Route to appropriate handler (booking inquiry, project update request, etc.)
    // - Store message in database
    // - Forward to admin if needed

    // For now, just acknowledge receipt
    // Twilio expects TwiML response
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Thank you for your message. We'll get back to you shortly.</Message>
      </Response>
    `);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/webhooks/twilio/status
 * Handle message status updates
 */
router.post('/twilio/status', async (req, res, next) => {
  try {
    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;

    console.log('Message status update:', {
      messageSid: MessageSid,
      status: MessageStatus,
      error: ErrorCode ? `${ErrorCode}: ${ErrorMessage}` : undefined,
    });

    // TODO: Update message status in database

    res.status(200).json({ status: 'received' });
  } catch (error) {
    next(error);
  }
});

// ----- Whisper Webhook (if using async transcription service) -----

/**
 * POST /api/webhooks/whisper
 * Handle transcription completion callbacks
 */
router.post('/whisper', async (req, res, next) => {
  try {
    const { jobId, status, result, error } = req.body;

    // Find consultation by whisper job ID
    const consultation = await Consultation.findOne({
      'transcription.whisperJobId': jobId,
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (status === 'completed' && result) {
      // Generate summary from transcription
      const summary = await whisperService.generateConsultationSummary(result.text);

      consultation.transcription = {
        status: 'completed',
        rawText: result.text,
        processedAt: new Date(),
        whisperJobId: jobId,
      };

      consultation.document = {
        title: summary.title,
        summary: summary.summary,
        keyPoints: summary.keyPoints,
        recommendations: summary.recommendations,
        nextSteps: summary.nextSteps,
        estimatedCost: summary.estimatedCost ? {
          min: summary.estimatedCost.min,
          max: summary.estimatedCost.max,
          notes: summary.estimatedCost.notes,
        } : undefined,
        attachments: [],
        status: 'pending-review',
      };
    } else if (status === 'failed') {
      consultation.transcription = {
        status: 'failed',
        whisperJobId: jobId,
      };
    }

    await consultation.save();

    res.status(200).json({ status: 'processed' });
  } catch (error) {
    next(error);
  }
});

export default router;
