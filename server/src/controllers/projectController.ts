import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

export const ProjectController = {
    async create(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Project name is required' });
            }

            const project = await ProjectService.createProject(req.user.id, name);
            res.status(201).json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create project' });
        }
    },

    async list(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const projects = await ProjectService.getUserProjects(req.user.id);
            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch projects' });
        }
    },
};
