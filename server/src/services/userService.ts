import { db } from '../config/db.js';

export const UserService = {
    async ensureUser(id: string, email: string, name?: string) {
        return db.user.upsert({
            where: { email },
            update: { name },
            create: {
                id,
                email,
                name,
            },
        });
    },

    async getUserById(id: string) {
        return db.user.findUnique({
            where: { id },
            include: { projects: true },
        });
    },
};
