// ==================================================
// Admin Content API
// ==================================================
// Handle CMS content read and write operations

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.json');

// ----- GET: Load content -----
export async function GET() {
  try {
    const fileContent = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    const content = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Failed to load content:', error);

    // If file doesn't exist, return default structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({
        success: true,
        data: getDefaultContent(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to load content' },
      { status: 500 }
    );
  }
}

// ----- POST: Save content -----
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the content structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid content format' },
        { status: 400 }
      );
    }

    // Ensure the data directory exists
    const dataDir = path.dirname(CONTENT_FILE_PATH);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Write the content to file
    await fs.writeFile(
      CONTENT_FILE_PATH,
      JSON.stringify(body, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
    });
  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save content' },
      { status: 500 }
    );
  }
}

// ----- Default Content Structure -----
function getDefaultContent() {
  return {
    business: {
      name: "Tailored Solutions",
      tagline: "Professional Electrical, Carpentry & Home Improvement Services",
      phone: "07XXX XXXXXX",
      email: "info@tailoredsolutions.co.uk",
      whatsapp: "447XXXXXXXXX",
      address: {
        street: "",
        city: "London",
        postcode: "",
        country: "United Kingdom"
      },
      serviceArea: "London and surrounding areas",
      hours: {
        weekdays: "8:00 AM - 6:00 PM",
        saturday: "9:00 AM - 4:00 PM",
        sunday: "Closed"
      },
      social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: ""
      }
    },
    stats: {
      yearsExperience: 15,
      projectsCompleted: 500,
      clientSatisfaction: 98,
      starRating: 4.9,
      referralRate: 85
    },
    homepage: {
      heroTitle: "Expert Home Improvement Solutions",
      heroSubtitle: "Transforming spaces with precision and care",
      ctaText: "Book a Free Consultation"
    },
    services: [],
    testimonials: [],
    portfolio: []
  };
}
