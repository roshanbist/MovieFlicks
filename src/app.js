import express from 'express';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());

app.use('/api/v1/movies', movieRoutes);

export default app;
