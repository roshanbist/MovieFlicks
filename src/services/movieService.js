import { BadRequestError } from '../utils/CustomError.js';

const getAllMovies = async (req, res, next) => {
  //
};

const getMovieById = async (req, res, next) => {
  //
};

const createNewMovie = async (movieData) => {
  return await movieData.save();
};

const updateMovieById = async (req, res, next) => {
  //
};

const deleteMovieById = async (req, res, next) => {
  //
};

export default {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovieById,
  deleteMovieById,
};
