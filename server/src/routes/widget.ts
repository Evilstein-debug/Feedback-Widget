import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { FeedbackController } from '../controllers/feedbackController';

const router = Router();

// Rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});

router.post('/feedback', limiter, FeedbackController.submit);

export default router;
