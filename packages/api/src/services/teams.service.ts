// ==================================================
// Microsoft Teams Integration Service
// ==================================================
// Handles Teams meeting creation, calendar events,
// and recording retrieval for consultation transcription

import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

// ----- Interfaces -----

export interface TeamsCredentials {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export interface MeetingRequest {
  clientEmail: string;
  clientName: string;
  scheduledAt: Date;
  duration: number; // minutes
  subject: string;
  description?: string;
}

export interface MeetingResponse {
  meetingId: string;
  meetingUrl: string;
  joinWebUrl: string;
  calendarEventId?: string;
}

export interface RecordingInfo {
  recordingUrl: string;
  createdAt: Date;
  duration: number;
  contentType: string;
}

// ----- Service Implementation -----

export class TeamsService {
  private graphClient: Client | null = null;
  private credentials: TeamsCredentials;
  private organizerUserId: string;

  constructor() {
    this.credentials = {
      clientId: process.env.AZURE_CLIENT_ID || '',
      clientSecret: process.env.AZURE_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_TENANT_ID || '',
    };
    this.organizerUserId = process.env.TEAMS_ORGANIZER_USER_ID || '';
  }

  /**
   * Initialize the Microsoft Graph client
   */
  private async getClient(): Promise<Client> {
    if (this.graphClient) {
      return this.graphClient;
    }

    const credential = new ClientSecretCredential(
      this.credentials.tenantId,
      this.credentials.clientId,
      this.credentials.clientSecret
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default'],
    });

    this.graphClient = Client.initWithMiddleware({
      authProvider,
    });

    return this.graphClient;
  }

  /**
   * Create an online Teams meeting
   */
  async createMeeting(request: MeetingRequest): Promise<MeetingResponse> {
    const client = await this.getClient();

    const startTime = new Date(request.scheduledAt);
    const endTime = new Date(startTime.getTime() + request.duration * 60000);

    try {
      // Create the online meeting
      const meeting = await client
        .api(`/users/${this.organizerUserId}/onlineMeetings`)
        .post({
          startDateTime: startTime.toISOString(),
          endDateTime: endTime.toISOString(),
          subject: request.subject,
          participants: {
            attendees: [
              {
                upn: request.clientEmail,
                role: 'attendee',
              },
            ],
          },
          lobbyBypassSettings: {
            scope: 'everyone',
            isDialInBypassEnabled: true,
          },
          recordAutomatically: true,
        });

      // Also create a calendar event for better visibility
      const calendarEvent = await this.createCalendarEvent({
        subject: request.subject,
        startTime,
        endTime,
        attendeeEmail: request.clientEmail,
        attendeeName: request.clientName,
        meetingUrl: meeting.joinWebUrl,
        description: request.description,
      });

      return {
        meetingId: meeting.id,
        meetingUrl: meeting.joinUrl,
        joinWebUrl: meeting.joinWebUrl,
        calendarEventId: calendarEvent?.id,
      };
    } catch (error) {
      console.error('Teams meeting creation error:', error);
      throw new Error(`Failed to create Teams meeting: ${(error as Error).message}`);
    }
  }

  /**
   * Create a calendar event with Teams meeting link
   */
  private async createCalendarEvent(params: {
    subject: string;
    startTime: Date;
    endTime: Date;
    attendeeEmail: string;
    attendeeName: string;
    meetingUrl: string;
    description?: string;
  }) {
    const client = await this.getClient();

    const bodyContent = `
      <h3>Consultation with ${params.attendeeName}</h3>
      ${params.description ? `<p>${params.description}</p>` : ''}
      <p><strong>Join the meeting:</strong></p>
      <p><a href="${params.meetingUrl}">${params.meetingUrl}</a></p>
      <hr>
      <p><em>This meeting will be recorded for documentation purposes.
      A summary will be shared with you after the consultation.</em></p>
    `;

    try {
      const event = await client
        .api(`/users/${this.organizerUserId}/calendar/events`)
        .post({
          subject: params.subject,
          body: {
            contentType: 'HTML',
            content: bodyContent,
          },
          start: {
            dateTime: params.startTime.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: params.endTime.toISOString(),
            timeZone: 'UTC',
          },
          location: {
            displayName: 'Microsoft Teams Meeting',
          },
          attendees: [
            {
              emailAddress: {
                address: params.attendeeEmail,
                name: params.attendeeName,
              },
              type: 'required',
            },
          ],
          isOnlineMeeting: true,
          onlineMeetingProvider: 'teamsForBusiness',
        });

      return event;
    } catch (error) {
      console.error('Calendar event creation error:', error);
      // Don't throw - meeting was created, calendar event is optional
      return null;
    }
  }

  /**
   * Get meeting details
   */
  async getMeeting(meetingId: string): Promise<any> {
    const client = await this.getClient();

    try {
      const meeting = await client
        .api(`/users/${this.organizerUserId}/onlineMeetings/${meetingId}`)
        .get();

      return meeting;
    } catch (error) {
      console.error('Get meeting error:', error);
      throw new Error(`Failed to get meeting: ${(error as Error).message}`);
    }
  }

  /**
   * Get meeting recordings
   * Note: Recordings are available through the meeting's content API
   */
  async getMeetingRecordings(meetingId: string): Promise<RecordingInfo[]> {
    const client = await this.getClient();

    try {
      // Get the meeting transcript and recording information
      const recordings = await client
        .api(`/users/${this.organizerUserId}/onlineMeetings/${meetingId}/recordings`)
        .get();

      if (!recordings.value || recordings.value.length === 0) {
        return [];
      }

      return recordings.value.map((recording: any) => ({
        recordingUrl: recording.recordingContentUrl,
        createdAt: new Date(recording.createdDateTime),
        duration: recording.recordingDuration || 0,
        contentType: recording.content?.contentType || 'video/mp4',
      }));
    } catch (error) {
      console.error('Get recordings error:', error);
      // Recordings might not be available yet
      return [];
    }
  }

  /**
   * Download recording content
   */
  async downloadRecording(recordingUrl: string): Promise<Buffer> {
    const client = await this.getClient();

    try {
      const response = await client.api(recordingUrl).getStream();

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of response) {
        chunks.push(Buffer.from(chunk));
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Download recording error:', error);
      throw new Error(`Failed to download recording: ${(error as Error).message}`);
    }
  }

  /**
   * Subscribe to meeting events (webhook)
   * Notifies when meeting ends or recording is available
   */
  async subscribeTtoMeetingEvents(
    meetingId: string,
    webhookUrl: string,
    expirationMinutes: number = 4320 // 3 days max
  ): Promise<string> {
    const client = await this.getClient();

    const expirationDateTime = new Date();
    expirationDateTime.setMinutes(expirationDateTime.getMinutes() + expirationMinutes);

    try {
      const subscription = await client.api('/subscriptions').post({
        changeType: 'updated',
        notificationUrl: webhookUrl,
        resource: `/users/${this.organizerUserId}/onlineMeetings/${meetingId}`,
        expirationDateTime: expirationDateTime.toISOString(),
        clientState: `meeting-${meetingId}`,
      });

      return subscription.id;
    } catch (error) {
      console.error('Subscription creation error:', error);
      throw new Error(`Failed to subscribe to meeting events: ${(error as Error).message}`);
    }
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(meetingId: string, calendarEventId?: string): Promise<void> {
    const client = await this.getClient();

    try {
      // Delete the online meeting
      await client
        .api(`/users/${this.organizerUserId}/onlineMeetings/${meetingId}`)
        .delete();

      // Also delete the calendar event if exists
      if (calendarEventId) {
        await client
          .api(`/users/${this.organizerUserId}/calendar/events/${calendarEventId}`)
          .delete();
      }
    } catch (error) {
      console.error('Cancel meeting error:', error);
      throw new Error(`Failed to cancel meeting: ${(error as Error).message}`);
    }
  }

  /**
   * Update meeting time
   */
  async rescheduleMeeting(
    meetingId: string,
    newStartTime: Date,
    duration: number,
    calendarEventId?: string
  ): Promise<void> {
    const client = await this.getClient();

    const endTime = new Date(newStartTime.getTime() + duration * 60000);

    try {
      // Update the online meeting
      await client
        .api(`/users/${this.organizerUserId}/onlineMeetings/${meetingId}`)
        .patch({
          startDateTime: newStartTime.toISOString(),
          endDateTime: endTime.toISOString(),
        });

      // Also update the calendar event if exists
      if (calendarEventId) {
        await client
          .api(`/users/${this.organizerUserId}/calendar/events/${calendarEventId}`)
          .patch({
            start: {
              dateTime: newStartTime.toISOString(),
              timeZone: 'UTC',
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: 'UTC',
            },
          });
      }
    } catch (error) {
      console.error('Reschedule meeting error:', error);
      throw new Error(`Failed to reschedule meeting: ${(error as Error).message}`);
    }
  }
}

// ----- Singleton Export -----

export const teamsService = new TeamsService();
