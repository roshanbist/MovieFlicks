import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
} from '../controllers/authController.js';

import { upload } from '../middleware/multerMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const routes = express.Router();

routes.post('/refresh', refreshAccessToken);
routes.post('/register', upload.single('avatar'), register);
routes.post('/login', login);
routes.post('/logout', authMiddleware, logout);
routes.post('/forgot-password', forgotPassword);
routes.post('/reset-password/:token', resetPassword);

export default routes;
