import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import path from 'path';

const app: Express = express();

//the final embeddable widget is served from this static file
app.use(
    "/widget.js",
    express.static(path.join(process.cwd(), "public/widget.js"), {
        setHeaders(res) {
            res.setHeader("Content-Type", "application/javascript");
        },
    })
);

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
