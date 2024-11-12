import express from 'express';

import {
  changePassword,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/accessControlMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const routes = express.Router();

routes.get('/', getAllUsers);
routes.get('/:id', getUserById);
routes.post('/change-password', authMiddleware, changePassword);
routes.put('/:id', authMiddleware, upload.single('avatar'), updateUserById);
routes.delete('/:id', authMiddleware, authorizeAdmin, deleteUserById);

export default routes;
