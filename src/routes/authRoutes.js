import express from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/authController.js';

import { upload } from '../middleware/multerMiddleware.js';

const routes = express.Router();

routes.post('/register', upload.single('avatar'), register);
routes.post('/login', login);
routes.post('/forgotPassword', forgotPassword);
routes.post('/resetPassword/:token', resetPassword);

export default routes;
