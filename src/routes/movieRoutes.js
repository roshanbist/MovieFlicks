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

// routes.post(
//   '/create',
//   upload.fields([
//     {
//       name: 'product',
//       maxCount: 1,
//     },
//     {
//       name: 'image',
//       maxCount: 1,
//     },
//   ]),
//   getTestData
// );

routes.post('/', upload.array('images', 5), createNewMovie);

routes.put('/:id', updateMovieById);
routes.delete('/:id', deleteMovieById);

export default routes;
