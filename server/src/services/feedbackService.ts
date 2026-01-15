import { db } from '../config/db';
import { FeedbackType } from '../../generated/prisma/client/client';

export const FeedbackService = {
    async createFeedback(projectKey: string, type: FeedbackType, message: string, userName?: string, userEmail?: string) {
        // we need to find the project first to link it
        const project = await db.project.findUnique({
            where: { projectKey },
        });

        if (!project) {
            throw new Error('Invalid Project Key');
        }

        return db.feedback.create({
            data: {
                projectId: project.id,
                type,
                message,
                userName,
                userEmail
            },
        });
    },

    async getFeedbackByProjectId(projectId: string) {
        return db.feedback.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
