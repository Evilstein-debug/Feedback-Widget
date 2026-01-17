import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { FeedbackController } from '../controllers/feedbackController.js';

const router = Router();

// Projects
router.post('/', ProjectController.create);
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.get);

// Feedback (Admin View)
router.get('/:projectId/feedback', FeedbackController.listByProject);

export default router;
