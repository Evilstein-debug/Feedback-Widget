import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export const mockAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    const userEmail = req.headers['x-user-email'] as string;
    const userName = req.headers['x-user-name'] as string;

    if (!userId || !userEmail) {
        // For public widget routes, we might not have user headers. 
        // Need to distinguish or apply this only to admin routes.
        // For now, let's just proceed without user if not found, 
        // but admin routes should check if req.user is set.
        return next();
    }

    try {
        // In a real app we would verify a token. 
        // Here we implicitly trust and sync the user to our DB.
        await UserService.ensureUser(userId, userEmail, userName);
        req.user = { id: userId, email: userEmail };
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: 'Internal Server Error during Auth' });
    }
};
