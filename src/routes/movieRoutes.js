import express from 'express';
import {
  createNewMovie,
  deleteMovieById,
  getAllMovies,
  getMovieById,
  updateMovieById,
} from '../controllers/movieController.js';

import { upload } from '../middleware/multerMiddleware.js';

const routes = express.Router();

routes.get('/', getAllMovies);
routes.get('/:id', getMovieById);

routes.post('/', upload.array('images', 5), createNewMovie);

// routes.put('/:id', updateMovieById);
routes.put('/:id', upload.array('images', 5), updateMovieById);
routes.delete('/:id', deleteMovieById);

export default routes;
