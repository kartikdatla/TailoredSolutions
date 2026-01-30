// ==================================================
// API Routes Index
// ==================================================

import { Router } from 'express';
import publicRoutes from './public.routes';
import clientRoutes from './client.routes';
import adminRoutes from './admin.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Mount route groups
router.use('/public', publicRoutes);
router.use('/client', clientRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
