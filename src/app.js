import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandlingMiddleware } from './middleware/errorHandlingMiddleware.js';
import { invalidRouteHandler } from './utils/generalUtils.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('*', invalidRouteHandler);

app.use(errorHandlingMiddleware);

export default app;
