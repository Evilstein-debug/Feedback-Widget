import { db } from '../config/db';

export const UserService = {
    async ensureUser(id: string, email: string, name?: string) {
        return db.user.upsert({
            where: { email },
            update: { name },
            create: {
                id, // strictly using the ID fromauth provider if provided, or let prisma generate if we didn't pass it (but we pass it)
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
