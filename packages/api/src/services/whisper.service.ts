// ==================================================
// WhisperAI Transcription Service
// ==================================================
// Handles audio transcription from Teams meetings and
// generates structured consultation documents using GPT-4

import OpenAI from 'openai';
import { ConsultationSummary, TranscriptSegment } from '@home-improvements/shared';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----- Interfaces -----

export interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  language: string;
  duration: number;
}

export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
}

// ----- Service Implementation -----

export class WhisperService {
  /**
   * Transcribe audio file using OpenAI Whisper API
   * Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
   * Max file size: 25MB
   */
  async transcribeAudio(
    audioBuffer: Buffer,
    filename: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      // Create a File object from the buffer
      const file = new File([audioBuffer], filename, {
        type: this.getMimeType(filename),
      });

      const response = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: options.language,
        prompt: options.prompt,
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      // Extract segments with timing information
      const segments: TranscriptSegment[] = (response.segments || []).map((seg) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      }));

      return {
        text: response.text,
        segments,
        language: response.language || 'en',
        duration: response.duration || 0,
      };
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw new Error(`Transcription failed: ${(error as Error).message}`);
    }
  }

  /**
   * Transcribe audio from URL (download first, then transcribe)
   */
  async transcribeFromUrl(
    audioUrl: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      // Download the audio file
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract filename from URL or use default
      const urlPath = new URL(audioUrl).pathname;
      const filename = urlPath.split('/').pop() || 'audio.mp3';

      return this.transcribeAudio(buffer, filename, options);
    } catch (error) {
      console.error('Whisper URL transcription error:', error);
      throw new Error(`URL transcription failed: ${(error as Error).message}`);
    }
  }

  /**
   * Generate structured consultation summary from transcription
   * Uses GPT-4 to analyze the conversation and extract key information
   */
  async generateConsultationSummary(transcription: string): Promise<ConsultationSummary> {
    const systemPrompt = `You are an assistant helping a professional electrician, carpenter, and home improvement specialist create consultation summaries for clients.

Your task is to analyze consultation transcripts and create clear, professional documents that clients can easily understand.

Guidelines:
- Use clear, non-technical language where possible
- Be specific about recommendations and next steps
- If cost estimates were discussed, include the range mentioned
- Highlight any safety concerns or compliance requirements
- Organize information logically

Output Format:
Return a JSON object with the following structure:
{
  "title": "Brief descriptive title for the consultation",
  "summary": "2-3 paragraph professional summary of the discussion",
  "keyPoints": ["Array of 5-8 main discussion points"],
  "recommendations": ["Professional recommendations made"],
  "nextSteps": ["Action items for client and professional"],
  "estimatedCost": {
    "min": number or null,
    "max": number or null,
    "notes": "Any context about the estimate"
  },
  "questionsFromClient": ["Questions the client asked"],
  "materialsDiscussed": ["Any materials, products, or brands mentioned"]
}`;

    const userPrompt = `Please analyze this consultation transcript and create a structured summary:

${transcription}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from GPT-4');
      }

      const summary = JSON.parse(content) as ConsultationSummary;

      // Validate required fields
      if (!summary.title || !summary.summary || !summary.keyPoints) {
        throw new Error('Invalid summary structure from GPT-4');
      }

      return summary;
    } catch (error) {
      console.error('GPT-4 summary generation error:', error);
      throw new Error(`Summary generation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Full pipeline: transcribe audio and generate summary
   */
  async processConsultationRecording(
    audioBuffer: Buffer,
    filename: string,
    options: TranscriptionOptions = {}
  ): Promise<{
    transcription: TranscriptionResult;
    summary: ConsultationSummary;
  }> {
    // Step 1: Transcribe the audio
    const transcription = await this.transcribeAudio(audioBuffer, filename, options);

    // Step 2: Generate summary from transcription
    const summary = await this.generateConsultationSummary(transcription.text);

    return { transcription, summary };
  }

  /**
   * Process recording from URL
   */
  async processConsultationFromUrl(
    audioUrl: string,
    options: TranscriptionOptions = {}
  ): Promise<{
    transcription: TranscriptionResult;
    summary: ConsultationSummary;
  }> {
    // Step 1: Transcribe from URL
    const transcription = await this.transcribeFromUrl(audioUrl, options);

    // Step 2: Generate summary
    const summary = await this.generateConsultationSummary(transcription.text);

    return { transcription, summary };
  }

  // ----- Helper Methods -----

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      mp4: 'audio/mp4',
      mpeg: 'audio/mpeg',
      mpga: 'audio/mpeg',
      m4a: 'audio/m4a',
      wav: 'audio/wav',
      webm: 'audio/webm',
    };
    return mimeTypes[ext || ''] || 'audio/mpeg';
  }
}

// ----- Singleton Export -----

export const whisperService = new WhisperService();
