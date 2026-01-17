import express, { Express } from 'express';
import cors from 'cors';

const app: Express = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());

import routes from './routes';
import path from 'path';

// Routes
app.use('/api', routes);

//the final embeddable widget is served from this static folder
app.use(
    express.static(path.join(__dirname, "../public"))
);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
