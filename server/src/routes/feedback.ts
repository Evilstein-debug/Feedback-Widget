import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController.js';

const router = Router();

// Admin Routes for Feedback
router.post('/:id/sentiment', FeedbackController.analyzeSentiment);

export default router;
