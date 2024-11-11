import express from 'express';

import {
  changePassword,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/userController.js';
import { authVerificationMiddleware } from '../middleware/authVerificationMiddleware.js';

const routes = express.Router();

routes.get('/', getAllUsers);
routes.get('/:id', getUserById);
routes.post('/change-password', authVerificationMiddleware, changePassword);
routes.put('/:id', authVerificationMiddleware, updateUserById);

export default routes;
