import express, { Express } from 'express';
import cors from 'cors';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

import routes from './routes';

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
