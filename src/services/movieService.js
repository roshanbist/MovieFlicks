import MovieModel from '../model/MovieModel.js';

const getAllMovies = async () => {
  return await MovieModel.find();
};

const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

const createNewMovie = async (movieData) => {
  return await movieData.save();
};

const updateMovieById = async (req, res, next) => {
  //
};

const deleteMovieById = async (id) => {
  return await MovieModel.findByIdAndDelete(id);
};

export default {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovieById,
  deleteMovieById,
};
