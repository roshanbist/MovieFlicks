import express from 'express';
import {
  createNewMovie,
  deleteMovieById,
  getAllMovies,
  getMovieById,
  updateMovieById,
} from '../controllers/movieController.js';

import { upload } from '../middleware/multerMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/accessControlMiddleware.js';

const routes = express.Router();

routes.get('/', getAllMovies);
routes.get('/:id', getMovieById);
routes.post('/', authMiddleware, upload.array('images', 5), createNewMovie);
routes.put('/:id', authMiddleware, upload.array('images', 5), updateMovieById);
routes.delete('/:id', authMiddleware, authorizeAdmin, deleteMovieById);

export default routes;
