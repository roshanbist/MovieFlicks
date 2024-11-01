import express from 'express';
import {
  createNewMovie,
  deleteMovieById,
  getAllMovies,
  getMovieById,
  updateMovieById,
} from '../controllers/movieController.js';

const routes = express.Router();

routes.get('/', getAllMovies);
routes.get('/:id', getMovieById);
routes.post('/', createNewMovie);
routes.put('/:id', updateMovieById);
routes.delete('/:id', deleteMovieById);

export default routes;
