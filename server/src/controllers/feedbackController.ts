import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedbackService.js';
import { ProjectService } from '../services/projectService.js';
import { FeedbackType } from '../../generated/prisma/client/client.js';

export const FeedbackController = {
    // Public Widget Endpoint
    async submit(req: Request, res: Response) {
        try {
            const { projectKey, type, message, userName, userEmail } = req.body;

            if (!projectKey || !message || !type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Validate type
            if (!Object.values(FeedbackType).includes(type)) {
                return res.status(400).json({ error: 'Invalid feedback type' });
            }

            const feedback = await FeedbackService.createFeedback(projectKey, type, message, userName, userEmail);
            res.status(201).json({ success: true, id: feedback.id });
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Invalid Project Key') {
                return res.status(404).json({ error: 'Invalid Project Key' });
            }
            res.status(500).json({ error: 'Failed to submit feedback' });
        }
    },

    // Admin Endpoint
    async listByProject(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { projectId } = req.params as { projectId: string };

            // Verify user owns the project
            const project = await ProjectService.getProjectById(projectId);
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
            if (project.userId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const feedbacks = await FeedbackService.getFeedbackByProjectId(projectId);
            res.json(feedbacks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    },
    async analyzeSentiment(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params as { id: string };

            const updatedFeedback = await FeedbackService.analyzeSentiment(id);
            res.json(updatedFeedback);
        } catch (error: any) {
            console.error(error);
            if (error.message === 'GEMINI_API_KEY is not set') {
                return res.status(500).json({ error: 'AI configuration missing' });
            }
            if (error.message === 'Feedback not found') {
                return res.status(404).json({ error: 'Feedback not found' });
            }
            res.status(500).json({ error: 'Failed to analyze sentiment' });
        }
    }
};
