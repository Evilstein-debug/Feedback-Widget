// widget/src/schema.ts
import { z } from "zod";

export const feedbackSchema = z.object({
    userName: z.string().optional(),
    userEmail: z.string().email().optional().or(z.literal("")),
    type: z.enum(["BUG", "FEATURE", "OTHER"]),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
