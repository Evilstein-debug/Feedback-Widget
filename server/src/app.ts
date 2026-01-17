import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import path from 'path';

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());

app.use('/api', routes);

//the final embeddable widget is served from this static folder
app.use(
    express.static(path.join(__dirname, "../public"))
);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
