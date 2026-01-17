import { db } from '../config/db.js';
import { FeedbackType } from '../../generated/prisma/client/client.js';

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

    async analyzeSentiment(feedbackId: string) {
        const { GoogleGenAI } = await import("@google/genai");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        const feedback = await db.feedback.findUnique({
            where: { id: feedbackId }
        });

        if (!feedback) {
            throw new Error("Feedback not found");
        }

        try {
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `Analyze the sentiment of the following feedback text. 
            Classify it into exactly one of these categories: POSITIVE, NEGATIVE, NEUTRAL, FRUSTRATED, HAPPY, URGENT.
            
            Feedback: "${feedback.message}"
            
            Respond with ONLY the category word.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: prompt,
            });

            const sentiment = (response?.text || "").trim().toUpperCase();

            // Validate sentiment is one of the allowed values, else default to NEUTRAL
            const allowedSentiments = ["POSITIVE", "NEGATIVE", "NEUTRAL", "FRUSTRATED", "HAPPY", "URGENT"];
            const finalSentiment = allowedSentiments.includes(sentiment) ? sentiment : "NEUTRAL";

            return db.feedback.update({
                where: { id: feedbackId },
                data: { sentiment: finalSentiment }
            });
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to analyze sentiment");
        }
    }
};
