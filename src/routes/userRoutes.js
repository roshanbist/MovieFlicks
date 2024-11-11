import express from 'express';

import { changePassword } from '../controllers/userController.js';
import { authVerificationMiddleware } from '../middleware/authVerificationMiddleware.js';

const routes = express.Router();

routes.post('/change-password', authVerificationMiddleware, changePassword);

export default routes;
