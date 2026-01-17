import { db } from '../config/db.js';

export const ProjectService = {
    async createProject(userId: string, name: string) {
        return db.project.create({
            data: {
                userId,
                name,
            },
        });
    },

    async getUserProjects(userId: string) {
        return db.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getProjectByKey(projectKey: string) {
        return db.project.findUnique({
            where: { projectKey },
        });
    },

    async getProjectById(id: string) {
        return db.project.findUnique({
            where: { id }
        })
    }
};
