import { Router } from 'express';
import projectRoutes from './projects.js';
import widgetRoutes from './widget.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Admin Routes (Protected)
router.use('/projects', authMiddleware, projectRoutes);

// Widget Routes (Public)
router.use('/widget', widgetRoutes);

export default router;
