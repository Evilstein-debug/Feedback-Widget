import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';

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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    console.log("Auth Middleware: Received Raw Token:", token);
    if (!token) {
        return next();
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.warn("JWT_SECRET is not set in environment variables. Auth verification skipped (WARNING).");
            return next();
        }

        console.log("Auth Middleware: Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        console.log("Auth Middleware: Token decoded successfully:", decoded.email);

        if (decoded.email) {
            const userId = decoded.sub || decoded.id;
            const userEmail = decoded.email;
            const userName = decoded.name;

            if (userEmail) {
                const user = await UserService.ensureUser(userId || userEmail, userEmail, userName || "User");
                console.log("Auth Middleware: User ensured in DB:", user.id);
                req.user = { id: user.id, email: user.email };
            } else {
                console.warn("Auth Middleware: No email in token");
            }
        } else {
            console.warn("Auth Middleware: Top level email missing in token");
        }

        next();
    } catch (error) {
        console.error("Auth Token Verification Failed:", error);
        return res.status(401).json({ error: 'Invalid Authentication Token' });
    }
};
