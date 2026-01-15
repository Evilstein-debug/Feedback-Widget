import { Router } from 'express';
import projectRoutes from './projects';
import widgetRoutes from './widget';
import { mockAuthMiddleware } from '../middleware/auth';

const router = Router();

// Admin Routes (Protected)
router.use('/projects', mockAuthMiddleware, projectRoutes);

// Widget Routes (Public)
router.use('/widget', widgetRoutes);

export default router;
