// ==================================================
// Authentication Middleware
// ==================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Client } from '@home-improvements/db/schemas';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

interface JwtPayload {
  userId?: string;
  clientId?: string;
  email: string;
  role: 'admin' | 'owner' | 'client';
}

/**
 * Admin/Owner authentication middleware
 * Verifies JWT and attaches user to request
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
      });
      return;
    }

    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not found' },
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if ((error as any).name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    });
  }
}

/**
 * Admin-only middleware
 * Must be used after authMiddleware
 */
export function adminOnly(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = (req as any).user;

  if (!user || !['admin', 'owner'].includes(user.role)) {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
    return;
  }

  next();
}

/**
 * Client portal authentication middleware
 * Verifies client JWT and attaches client to request
 */
export async function clientAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.clientId) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid client token' },
      });
      return;
    }

    const client = await Client.findById(decoded.clientId);

    if (!client) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Client not found' },
      });
      return;
    }

    (req as any).client = client;
    next();
  } catch (error) {
    if ((error as any).name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    });
  }
}

/**
 * Generate JWT token for admin/owner
 */
export function generateAdminToken(user: { _id: string; email: string; role: string }): string {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/**
 * Generate refresh token for admin/owner
 */
export function generateAdminRefreshToken(user: { _id: string; email: string }): string {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '-refresh';
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      type: 'refresh',
    },
    refreshSecret,
    { expiresIn: '7d' }
  );
}

/**
 * Generate JWT token for client
 */
export function generateClientToken(client: { _id: string; email: string }): string {
  return jwt.sign(
    {
      clientId: client._id,
      email: client.email,
      role: 'client',
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '-refresh';
    return jwt.verify(token, refreshSecret) as JwtPayload;
  } catch {
    return null;
  }
}
