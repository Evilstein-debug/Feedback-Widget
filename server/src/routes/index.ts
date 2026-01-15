import { Router } from 'express';
import projectRoutes from './projects';
import widgetRoutes from './widget';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Admin Routes (Protected)
router.use('/projects', authMiddleware, projectRoutes);

// Widget Routes (Public)
router.use('/widget', widgetRoutes);

export default router;
