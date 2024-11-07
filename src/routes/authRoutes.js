import express from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/authController.js';

const routes = express.Router();

routes.post('/register', register);
routes.post('/login', login);
routes.post('/forgotPassword', forgotPassword);
routes.post('/resetPassword/:token', resetPassword);

export default routes;
