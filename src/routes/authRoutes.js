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
import { verifyJwtToken } from '../middleware/authMiddleware.js';

const routes = express.Router();

routes.get('/refresh', refreshAccessToken);
routes.post('/register', upload.single('avatar'), register);
routes.post('/login', login);
routes.post('/logout', verifyJwtToken, logout);
routes.post('/forgot-password', forgotPassword);
routes.post('/resetPassword/:token', resetPassword);

export default routes;
