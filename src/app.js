import express from 'express';
import dotenv from 'dotenv';

import movieRoutes from './routes/movieRoutes.js';
import { errorHandlingMiddleware } from './middleware/errorHandlingMiddleware.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());

app.use('/api/v1/movies', movieRoutes);

app.use(errorHandlingMiddleware);

export default app;
