import { Router } from 'express';
import projectRoutes from './projects.js';
import widgetRoutes from './widget.js';
import feedbackRoutes from './feedback.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Admin Routes (Protected)
router.use('/projects', authMiddleware, projectRoutes);
router.use('/feedback', authMiddleware, feedbackRoutes);

// Widget Routes (Public)
router.use('/widget', widgetRoutes);

export default router;
