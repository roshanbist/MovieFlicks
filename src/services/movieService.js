import MovieModel from '../model/MovieModel.js';

const getAllMovies = async () => {
  const totalMovies = await MovieModel.find().countDocuments();
  const movieList = await MovieModel.find();
  return { totalMovies, movieList };
};

const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

const createNewMovie = async (movieData) => {
  return await movieData.save();
};

const updateMovieById = async (id, movieData) => {
  return await MovieModel.findByIdAndUpdate(id, movieData, {
    new: true,
    runValidators: true,
  });
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
