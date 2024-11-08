import MovieModel from '../model/MovieModel.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import { mergeQueryParams } from '../utils/generalUtils.js';

const getAllMovies = async (queryParams) => {
  let currentPage, limitPage, offset, totalPages, hasPreviousPage, hasNextPage;

  const { query, sortQuery } = mergeQueryParams(queryParams);
  const totalMovies = await MovieModel.find(query).countDocuments();

  if (queryParams.limit) {
    currentPage = parseInt(queryParams.page) || 1;
    limitPage = parseInt(queryParams.limit) || 10;
    offset = (currentPage - 1) * 10;

    totalPages = Math.ceil(totalMovies / limitPage);
    hasPreviousPage = currentPage > 1;
    hasNextPage = currentPage < totalPages;
  }

  const movieList = await MovieModel.find(query)
    .sort(sortQuery)
    .limit(limitPage)
    .skip(offset)
    .exec();

  return { totalMovies, movieList, totalPages, hasPreviousPage, hasNextPage };
};

const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

const createNewMovie = async (movieData) => {
  try {
    return await movieData.save();
  } catch (error) {
    if (movieData.cloudinaryId && movieData.cloudinaryId.length > 0) {
      await Promise.all(
        movieData.cloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    throw error;
  }
};

const updateMovieById = async (id, movieData) => {
  try {
    return await MovieModel.findByIdAndUpdate(id, movieData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    if (movieData.cloudinaryId && movieData.cloudinaryId.length > 0) {
      await Promise.all(
        movieData.cloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    throw error;
  }
};

const deleteMovieById = async (id) => {
  const movie = await MovieModel.findById(id);

  if (movie.cloudinaryId && movie.cloudinaryId.length > 0) {
    await Promise.all(movie.cloudinaryId.map((id) => deleteFromCloudinary(id)));
  }

  return await MovieModel.findByIdAndDelete(id);
};

export default {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovieById,
  deleteMovieById,
};
