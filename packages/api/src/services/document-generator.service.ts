// ==================================================
// Consultation Document Generator Service
// ==================================================
// Generates comprehensive consultation documents that include:
// - Executive summary (layperson-friendly)
// - Technical assessment (expert-level detail)
// - Scope of work with phases
// - Materials specification
// - Recommendations
// - Next steps
// All formatted to be professional yet accessible

import OpenAI from 'openai';
import {
  ConsultationDocumentFull,
  WorkItem,
  WorkPhase,
  MaterialSpecification,
  Recommendation,
  NextStep,
  TranscriptionStatus,
} from '@home-improvements/shared';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----- Interfaces -----

export interface DocumentGenerationInput {
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
    rawText: string;
    segments?: Array<{
      speaker: 'client' | 'consultant' | 'agent';
      text: string;
      timestamp: number;
      confidence: number;
    }>;
  };
  serviceCategory: 'electrical' | 'carpentry' | 'home-improvement' | 'general';
}

export interface GeneratedDocument {
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
}

// ----- Service Implementation -----

export class DocumentGeneratorService {
  /**
   * Generate a complete consultation document from transcription
   */
  async generateDocument(input: DocumentGenerationInput): Promise<ConsultationDocumentFull> {
    const generatedDoc = await this.analyzeAndGenerateContent(input);

    const document: ConsultationDocumentFull = {
      id: `doc-${Date.now()}`,
      consultationId: input.consultationId,
      bookingId: input.bookingId,
      clientInfo: input.clientInfo,
      meetingInfo: input.meetingInfo,
      transcription: {
        status: 'completed' as TranscriptionStatus,
        rawText: input.transcription.rawText,
        segments: input.transcription.segments,
        processedAt: new Date(),
      },
      document: {
        ...generatedDoc,
        appendices: [],
      },
      status: 'ready',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return document;
  }

  /**
   * Main analysis function that uses GPT-4 to generate document content
   */
  private async analyzeAndGenerateContent(input: DocumentGenerationInput): Promise<GeneratedDocument> {
    const systemPrompt = this.buildSystemPrompt(input.serviceCategory);
    const userPrompt = this.buildUserPrompt(input);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 8000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from GPT-4');
      }

      const parsed = JSON.parse(content);
      return this.validateAndEnhanceDocument(parsed, input.serviceCategory);
    } catch (error) {
      console.error('Document generation error:', error);
      throw new Error(`Document generation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Build the system prompt based on service category
   */
  private buildSystemPrompt(serviceCategory: string): string {
    const expertiseMap: Record<string, string> = {
      electrical: `You are an expert NICEIC-certified electrician with 25+ years of experience in residential and commercial electrical work in the UK. You understand Part P regulations, BS 7671 wiring regulations, and all relevant UK electrical standards.`,
      carpentry: `You are a master carpenter and joiner with 25+ years of experience in bespoke furniture, fitted kitchens, structural carpentry, and fine woodworking. You understand UK building regulations, fire safety requirements, and traditional and modern joinery techniques.`,
      'home-improvement': `You are an experienced general contractor and builder with 25+ years of experience in complete home renovations, extensions, and improvements. You understand UK building regulations, planning permission requirements, and all aspects of construction work.`,
      general: `You are a multi-skilled tradesperson with expertise in electrical work, carpentry, plumbing basics, and general home improvements. You understand UK building regulations and best practices across multiple trades.`,
    };

    return `${expertiseMap[serviceCategory] || expertiseMap.general}

You are creating a consultation document for a client based on a recorded consultation call. The document must serve two audiences:

1. **THE CLIENT (LAYPERSON)**: Use clear, non-technical language. Explain WHY things need to be done, not just WHAT. Use analogies and examples. Avoid jargon or explain it when used.

2. **FELLOW PROFESSIONALS**: Include proper technical specifications, part numbers, relevant regulations, and industry-standard terminology where appropriate.

Your document should be:
- Professional and reassuring
- Clear about pricing (provide realistic UK market rates)
- Honest about any concerns or complications
- Helpful for decision-making
- Compliant with UK regulations and standards

CRITICAL: The "laymanExplanation" in WorkItems must be genuinely helpful explanations, not just simplified rewording. Help the client understand:
- Why this work matters
- What happens if it's not done
- How it will improve their property/life

Return a JSON object matching the exact schema provided.`;
  }

  /**
   * Build the user prompt with transcription and context
   */
  private buildUserPrompt(input: DocumentGenerationInput): string {
    return `Please analyze this consultation transcript and generate a comprehensive consultation document.

## CLIENT INFORMATION
- Name: ${input.clientInfo.name}
- Property Type: ${input.clientInfo.propertyType}
- Location: ${input.clientInfo.location}
- Service Category: ${input.serviceCategory}

## CONSULTATION DETAILS
- Date: ${input.meetingInfo.date}
- Duration: ${input.meetingInfo.duration} minutes

## TRANSCRIPT
${input.transcription.rawText}

---

Please generate a JSON document with the following structure:

{
  "executiveSummary": {
    "projectOverview": "2-3 paragraph overview in clear, non-technical language explaining what was discussed and what work is recommended. This should read like a friendly letter to the client.",
    "mainObjectives": ["List of 4-6 main objectives/goals discussed"],
    "estimatedTimeline": "Realistic timeline estimate, e.g., '2-3 weeks from approval'",
    "budgetRange": {
      "min": <minimum estimate in GBP>,
      "max": <maximum estimate in GBP>,
      "currency": "GBP"
    }
  },
  "technicalAssessment": {
    "currentCondition": "Technical assessment of current state for professional records",
    "workRequired": [
      {
        "area": "Name of area/room/system",
        "description": "What needs to be done (clear for client)",
        "technicalDetails": "Technical specification for professional reference (include regulation numbers, wire sizes, material grades, etc.)",
        "laymanExplanation": "Why this matters explained simply - use analogies if helpful",
        "priority": "essential" | "recommended" | "optional",
        "estimatedCost": { "min": <number>, "max": <number> }
      }
    ],
    "complianceNotes": ["Relevant regulations, certifications, or compliance requirements"],
    "safetyConsiderations": ["Any safety concerns or precautions needed"]
  },
  "scopeOfWork": [
    {
      "phase": 1,
      "title": "Phase name",
      "tasks": [
        {
          "task": "Task name",
          "details": "Detailed description",
          "materials": ["Required materials"],
          "labourHours": <estimated hours>
        }
      ],
      "estimatedDuration": "e.g., '2-3 days'",
      "costBreakdown": {
        "labour": <cost>,
        "materials": <cost>,
        "total": <cost>
      }
    }
  ],
  "materialsSpecification": [
    {
      "item": "Material name",
      "specification": "Technical specification",
      "alternatives": [
        {
          "item": "Alternative option",
          "costDifference": <positive or negative number>,
          "notes": "Why choose this alternative"
        }
      ],
      "quantity": "Amount needed",
      "unitCost": <cost per unit>,
      "totalCost": <total cost>
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "What we recommend (clear for client)",
      "reasoning": "Why this is recommended - explain benefits",
      "impact": "high" | "medium" | "low",
      "costImplication": "increase" | "decrease" | "neutral"
    }
  ],
  "nextSteps": [
    {
      "step": 1,
      "action": "What needs to happen",
      "owner": "client" | "contractor",
      "deadline": "Optional deadline or timeframe",
      "notes": "Any additional notes"
    }
  ],
  "termsAndConditions": {
    "paymentTerms": "Standard payment terms (e.g., 30% deposit, balance on completion)",
    "warranty": "Warranty/guarantee information",
    "cancellationPolicy": "Cancellation terms",
    "insuranceInfo": "Public liability and professional indemnity coverage"
  }
}

Ensure all estimates are realistic for UK market rates in ${new Date().getFullYear()}. Be specific about materials and avoid vague descriptions.`;
  }

  /**
   * Validate and enhance the generated document
   */
  private validateAndEnhanceDocument(doc: any, serviceCategory: string): GeneratedDocument {
    // Add default terms if not provided
    const defaultTerms = {
      paymentTerms: '30% deposit upon acceptance of quote. Balance due upon satisfactory completion of work. We accept bank transfer, credit/debit cards, and cheques.',
      warranty: 'All work comes with a 12-month workmanship guarantee. Any defects arising from our work within this period will be rectified free of charge.',
      cancellationPolicy: 'Written notice required at least 48 hours before scheduled start date for cancellation. Deposit non-refundable if materials have been ordered.',
      insuranceInfo: 'We carry full public liability insurance (£5m) and professional indemnity insurance. Certificates available upon request.',
    };

    // Add electrical-specific warranty if applicable
    if (serviceCategory === 'electrical') {
      defaultTerms.warranty += ' Electrical work is certified under Part P of the Building Regulations. Electrical Installation Certificate (EIC) or Minor Works Certificate provided as appropriate.';
    }

    return {
      executiveSummary: {
        projectOverview: doc.executiveSummary?.projectOverview || 'Document generation in progress.',
        mainObjectives: doc.executiveSummary?.mainObjectives || [],
        estimatedTimeline: doc.executiveSummary?.estimatedTimeline || 'To be determined',
        budgetRange: {
          min: doc.executiveSummary?.budgetRange?.min || 0,
          max: doc.executiveSummary?.budgetRange?.max || 0,
          currency: doc.executiveSummary?.budgetRange?.currency || 'GBP',
        },
      },
      technicalAssessment: {
        currentCondition: doc.technicalAssessment?.currentCondition || '',
        workRequired: (doc.technicalAssessment?.workRequired || []).map((item: any) => ({
          area: item.area || '',
          description: item.description || '',
          technicalDetails: item.technicalDetails || '',
          laymanExplanation: item.laymanExplanation || '',
          priority: item.priority || 'recommended',
          estimatedCost: {
            min: item.estimatedCost?.min || 0,
            max: item.estimatedCost?.max || 0,
          },
        })),
        complianceNotes: doc.technicalAssessment?.complianceNotes || [],
        safetyConsiderations: doc.technicalAssessment?.safetyConsiderations || [],
      },
      scopeOfWork: (doc.scopeOfWork || []).map((phase: any, index: number) => ({
        phase: phase.phase || index + 1,
        title: phase.title || `Phase ${index + 1}`,
        tasks: (phase.tasks || []).map((task: any) => ({
          task: task.task || '',
          details: task.details || '',
          materials: task.materials || [],
          labourHours: task.labourHours || 0,
        })),
        estimatedDuration: phase.estimatedDuration || 'TBD',
        costBreakdown: {
          labour: phase.costBreakdown?.labour || 0,
          materials: phase.costBreakdown?.materials || 0,
          total: phase.costBreakdown?.total || 0,
        },
      })),
      materialsSpecification: (doc.materialsSpecification || []).map((mat: any) => ({
        item: mat.item || '',
        specification: mat.specification || '',
        alternatives: (mat.alternatives || []).map((alt: any) => ({
          item: alt.item || '',
          costDifference: alt.costDifference || 0,
          notes: alt.notes || '',
        })),
        quantity: mat.quantity || '',
        unitCost: mat.unitCost || 0,
        totalCost: mat.totalCost || 0,
      })),
      recommendations: (doc.recommendations || []).map((rec: any) => ({
        title: rec.title || '',
        description: rec.description || '',
        reasoning: rec.reasoning || '',
        impact: rec.impact || 'medium',
        costImplication: rec.costImplication || 'neutral',
      })),
      nextSteps: (doc.nextSteps || []).map((step: any, index: number) => ({
        step: step.step || index + 1,
        action: step.action || '',
        owner: step.owner || 'contractor',
        deadline: step.deadline,
        notes: step.notes,
      })),
      termsAndConditions: {
        paymentTerms: doc.termsAndConditions?.paymentTerms || defaultTerms.paymentTerms,
        warranty: doc.termsAndConditions?.warranty || defaultTerms.warranty,
        cancellationPolicy: doc.termsAndConditions?.cancellationPolicy || defaultTerms.cancellationPolicy,
        insuranceInfo: doc.termsAndConditions?.insuranceInfo || defaultTerms.insuranceInfo,
      },
    };
  }

  /**
   * Generate a PDF-ready HTML version of the document
   */
  generateHtmlDocument(doc: ConsultationDocumentFull): string {
    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

    const formatDate = (date: Date) =>
      new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Document - ${doc.clientInfo.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0ea5e9; }
    .logo { font-size: 28px; font-weight: bold; color: #0f172a; margin-bottom: 10px; }
    .logo span { color: #0ea5e9; }
    .document-title { font-size: 24px; color: #334155; margin-top: 20px; }
    .client-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .client-info h3 { color: #0ea5e9; margin-bottom: 10px; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 20px; color: #0f172a; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
    .subsection { margin-bottom: 20px; }
    .subsection-title { font-size: 16px; color: #475569; margin-bottom: 10px; font-weight: 600; }
    .work-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .work-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .work-item-area { font-weight: 600; color: #0f172a; }
    .priority-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .priority-essential { background: #fee2e2; color: #dc2626; }
    .priority-recommended { background: #fef3c7; color: #d97706; }
    .priority-optional { background: #dbeafe; color: #2563eb; }
    .technical-details { background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px; font-size: 13px; color: #64748b; }
    .layman-explanation { background: #ecfdf5; padding: 15px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #10b981; }
    .phase-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .phase-number { background: #0ea5e9; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .cost-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .cost-table th, .cost-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .cost-table th { background: #f8fafc; font-weight: 600; }
    .cost-table .total { font-weight: 600; background: #f0f9ff; }
    .recommendation-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .impact-high { border-left: 4px solid #dc2626; }
    .impact-medium { border-left: 4px solid #d97706; }
    .impact-low { border-left: 4px solid #2563eb; }
    .next-step { display: flex; gap: 15px; padding: 15px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; }
    .step-number { background: #0f172a; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
    .owner-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .owner-client { background: #dbeafe; color: #2563eb; }
    .owner-contractor { background: #dcfce7; color: #16a34a; }
    .terms-section { background: #f8fafc; padding: 20px; border-radius: 8px; }
    .terms-item { margin-bottom: 15px; }
    .terms-item h4 { color: #475569; margin-bottom: 5px; }
    .budget-highlight { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
    .budget-range { font-size: 32px; font-weight: bold; margin: 10px 0; }
    .footer { margin-top: 60px; padding-top: 30px; border-top: 3px solid #0ea5e9; text-align: center; }
    @media print { .container { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Tailored<span>Solutions</span></div>
      <p>Premium Electrician, Carpentry & Home Improvements</p>
      <h1 class="document-title">Consultation Document</h1>
    </div>

    <div class="client-info">
      <h3>Prepared For</h3>
      <p><strong>${doc.clientInfo.name}</strong></p>
      <p>${doc.clientInfo.propertyType} - ${doc.clientInfo.location}</p>
      <p>Consultation Date: ${formatDate(doc.meetingInfo.date)}</p>
    </div>

    <!-- Executive Summary -->
    <div class="section">
      <h2 class="section-title">Executive Summary</h2>
      <p style="margin-bottom: 20px;">${doc.document.executiveSummary.projectOverview}</p>

      <div class="subsection">
        <h3 class="subsection-title">Main Objectives</h3>
        <ul style="padding-left: 20px;">
          ${doc.document.executiveSummary.mainObjectives.map(obj => `<li style="margin-bottom: 8px;">${obj}</li>`).join('')}
        </ul>
      </div>

      <div class="budget-highlight">
        <p>Estimated Project Budget</p>
        <div class="budget-range">${formatCurrency(doc.document.executiveSummary.budgetRange.min)} - ${formatCurrency(doc.document.executiveSummary.budgetRange.max)}</div>
        <p>Estimated Timeline: ${doc.document.executiveSummary.estimatedTimeline}</p>
      </div>
    </div>

    <!-- Technical Assessment -->
    <div class="section">
      <h2 class="section-title">Technical Assessment</h2>

      <div class="subsection">
        <h3 class="subsection-title">Current Condition</h3>
        <p>${doc.document.technicalAssessment.currentCondition}</p>
      </div>

      <div class="subsection">
        <h3 class="subsection-title">Work Required</h3>
        ${doc.document.technicalAssessment.workRequired.map(item => `
          <div class="work-item">
            <div class="work-item-header">
              <span class="work-item-area">${item.area}</span>
              <span class="priority-badge priority-${item.priority}">${item.priority}</span>
            </div>
            <p><strong>What needs to be done:</strong> ${item.description}</p>
            <div class="layman-explanation">
              <strong>Why this matters:</strong> ${item.laymanExplanation}
            </div>
            <div class="technical-details">
              <strong>Technical Specifications:</strong> ${item.technicalDetails}
            </div>
            <p style="margin-top: 10px;"><strong>Estimated Cost:</strong> ${formatCurrency(item.estimatedCost.min)} - ${formatCurrency(item.estimatedCost.max)}</p>
          </div>
        `).join('')}
      </div>

      ${doc.document.technicalAssessment.safetyConsiderations.length > 0 ? `
        <div class="subsection">
          <h3 class="subsection-title">Safety Considerations</h3>
          <ul style="padding-left: 20px;">
            ${doc.document.technicalAssessment.safetyConsiderations.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${doc.document.technicalAssessment.complianceNotes.length > 0 ? `
        <div class="subsection">
          <h3 class="subsection-title">Compliance & Regulations</h3>
          <ul style="padding-left: 20px;">
            ${doc.document.technicalAssessment.complianceNotes.map(n => `<li style="margin-bottom: 8px;">${n}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>

    <!-- Scope of Work -->
    <div class="section">
      <h2 class="section-title">Scope of Work</h2>
      ${doc.document.scopeOfWork.map(phase => `
        <div class="phase-card">
          <div class="phase-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="phase-number">${phase.phase}</div>
              <div>
                <strong>${phase.title}</strong>
                <p style="font-size: 13px; color: #64748b;">Duration: ${phase.estimatedDuration}</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 13px; color: #64748b;">Phase Total</p>
              <p style="font-weight: bold; color: #0ea5e9;">${formatCurrency(phase.costBreakdown.total)}</p>
            </div>
          </div>
          <ul style="padding-left: 20px;">
            ${phase.tasks.map(task => `
              <li style="margin-bottom: 10px;">
                <strong>${task.task}</strong>
                <p style="font-size: 14px; color: #64748b;">${task.details}</p>
                ${task.materials && task.materials.length > 0 ? `<p style="font-size: 13px; color: #94a3b8;">Materials: ${task.materials.join(', ')}</p>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <!-- Materials -->
    ${doc.document.materialsSpecification.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Materials Specification</h2>
        <table class="cost-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Specification</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${doc.document.materialsSpecification.map(mat => `
              <tr>
                <td><strong>${mat.item}</strong></td>
                <td>${mat.specification}</td>
                <td>${mat.quantity}</td>
                <td>${formatCurrency(mat.unitCost)}</td>
                <td>${formatCurrency(mat.totalCost)}</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="4"><strong>Total Materials Cost</strong></td>
              <td><strong>${formatCurrency(doc.document.materialsSpecification.reduce((sum, m) => sum + m.totalCost, 0))}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Recommendations -->
    ${doc.document.recommendations.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Our Recommendations</h2>
        ${doc.document.recommendations.map(rec => `
          <div class="recommendation-card impact-${rec.impact}">
            <h4>${rec.title}</h4>
            <p style="margin: 10px 0;">${rec.description}</p>
            <p style="font-style: italic; color: #64748b;">${rec.reasoning}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Next Steps -->
    <div class="section">
      <h2 class="section-title">Next Steps</h2>
      ${doc.document.nextSteps.map(step => `
        <div class="next-step">
          <div class="step-number">${step.step}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>${step.action}</strong>
              <span class="owner-badge owner-${step.owner}">${step.owner}</span>
            </div>
            ${step.deadline ? `<p style="font-size: 13px; color: #64748b; margin-top: 4px;">Deadline: ${step.deadline}</p>` : ''}
            ${step.notes ? `<p style="font-size: 14px; color: #475569; margin-top: 4px;">${step.notes}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Terms -->
    <div class="section">
      <h2 class="section-title">Terms & Conditions</h2>
      <div class="terms-section">
        <div class="terms-item">
          <h4>Payment Terms</h4>
          <p>${doc.document.termsAndConditions.paymentTerms}</p>
        </div>
        <div class="terms-item">
          <h4>Warranty</h4>
          <p>${doc.document.termsAndConditions.warranty}</p>
        </div>
        <div class="terms-item">
          <h4>Cancellation Policy</h4>
          <p>${doc.document.termsAndConditions.cancellationPolicy}</p>
        </div>
        <div class="terms-item">
          <h4>Insurance</h4>
          <p>${doc.document.termsAndConditions.insuranceInfo}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="logo">Tailored<span>Solutions</span></div>
      <p style="margin-top: 10px; color: #64748b;">
        This document was generated from your video consultation.<br>
        For questions, contact us at info@tailoredsolutions.co.uk or call 01234 567890
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
        Generated on ${formatDate(new Date())} | Document ID: ${doc.id}
      </p>
    </div>
  </div>
</body>
</html>`;
  }
}

// ----- Singleton Export -----

export const documentGeneratorService = new DocumentGeneratorService();
