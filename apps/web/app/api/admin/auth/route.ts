import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');

// Simple password hashing (for demonstration - in production use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate a simple session token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory session store (in production, use Redis or database)
const sessions: Map<string, { email: string; expires: number }> = new Map();

function getContent() {
  try {
    const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function saveContent(content: Record<string, unknown>) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, currentPassword, newPassword, token } = body;

    const content = getContent();
    if (!content) {
      return NextResponse.json({ success: false, error: 'Failed to load configuration' }, { status: 500 });
    }

    // Initialize admin if not exists
    if (!content.admin) {
      content.admin = {
        email: 'admin@tailoredsolutions.co.uk',
        passwordHash: '',
        setupComplete: false,
      };
    }

    switch (action) {
      case 'setup': {
        // Initial setup - create admin account
        if (content.admin.setupComplete) {
          return NextResponse.json({ success: false, error: 'Setup already completed' }, { status: 400 });
        }

        if (!email || !password) {
          return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
        }

        if (password.length < 6) {
          return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        content.admin = {
          email: email.toLowerCase(),
          passwordHash: hashPassword(password),
          setupComplete: true,
        };

        saveContent(content);

        // Create session
        const sessionToken = generateToken();
        sessions.set(sessionToken, {
          email: email.toLowerCase(),
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        const response = NextResponse.json({ success: true, message: 'Admin account created' });
        response.cookies.set('admin_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        });

        return response;
      }

      case 'login': {
        if (!content.admin.setupComplete) {
          return NextResponse.json({ success: false, error: 'Admin account not set up', needsSetup: true }, { status: 401 });
        }

        if (!email || !password) {
          return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
        }

        if (email.toLowerCase() !== content.admin.email || !verifyPassword(password, content.admin.passwordHash)) {
          return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        const sessionToken = generateToken();
        sessions.set(sessionToken, {
          email: email.toLowerCase(),
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        const response = NextResponse.json({ success: true, message: 'Login successful' });
        response.cookies.set('admin_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        });

        return response;
      }

      case 'logout': {
        const sessionToken = request.cookies.get('admin_session')?.value;
        if (sessionToken) {
          sessions.delete(sessionToken);
        }

        const response = NextResponse.json({ success: true, message: 'Logged out' });
        response.cookies.delete('admin_session');
        return response;
      }

      case 'verify': {
        const sessionToken = token || request.cookies.get('admin_session')?.value;
        if (!sessionToken) {
          return NextResponse.json({ success: false, authenticated: false });
        }

        const session = sessions.get(sessionToken);
        if (!session || session.expires < Date.now()) {
          sessions.delete(sessionToken);
          return NextResponse.json({ success: false, authenticated: false });
        }

        return NextResponse.json({
          success: true,
          authenticated: true,
          email: session.email,
          setupComplete: content.admin.setupComplete,
        });
      }

      case 'change-password': {
        const sessionToken = request.cookies.get('admin_session')?.value;
        if (!sessionToken) {
          return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const session = sessions.get(sessionToken);
        if (!session || session.expires < Date.now()) {
          return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
        }

        if (!currentPassword || !newPassword) {
          return NextResponse.json({ success: false, error: 'Current and new password required' }, { status: 400 });
        }

        if (!verifyPassword(currentPassword, content.admin.passwordHash)) {
          return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
        }

        if (newPassword.length < 6) {
          return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        content.admin.passwordHash = hashPassword(newPassword);
        saveContent(content);

        return NextResponse.json({ success: true, message: 'Password changed successfully' });
      }

      case 'change-email': {
        const sessionToken = request.cookies.get('admin_session')?.value;
        if (!sessionToken) {
          return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const session = sessions.get(sessionToken);
        if (!session || session.expires < Date.now()) {
          return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
        }

        if (!email || !password) {
          return NextResponse.json({ success: false, error: 'New email and current password required' }, { status: 400 });
        }

        if (!verifyPassword(password, content.admin.passwordHash)) {
          return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
        }

        content.admin.email = email.toLowerCase();
        saveContent(content);

        // Update session
        session.email = email.toLowerCase();

        return NextResponse.json({ success: true, message: 'Email changed successfully' });
      }

      case 'check-setup': {
        return NextResponse.json({
          success: true,
          setupComplete: content.admin.setupComplete,
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Verify session
  const sessionToken = request.cookies.get('admin_session')?.value;

  const content = getContent();
  if (!content) {
    return NextResponse.json({ success: false, error: 'Failed to load configuration' }, { status: 500 });
  }

  if (!sessionToken) {
    return NextResponse.json({
      success: true,
      authenticated: false,
      setupComplete: content.admin?.setupComplete || false,
    });
  }

  const session = sessions.get(sessionToken);
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionToken);
    return NextResponse.json({
      success: true,
      authenticated: false,
      setupComplete: content.admin?.setupComplete || false,
    });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    email: session.email,
    setupComplete: content.admin?.setupComplete || false,
  });
}
