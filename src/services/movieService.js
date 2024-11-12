import MovieModel from '../model/MovieModel.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import { BadRequestError } from '../utils/CustomError.js';
import { mergeQueryParams } from '../utils/generalUtils.js';

const getAllMovies = async (queryParams) => {
  let currentPage,
    limitPage,
    offset,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    queryMatchingMovies;

  const { query, sortQuery } = mergeQueryParams(queryParams);

  console.log('query', query);

  if (Object.keys(query).length > 0) {
    queryMatchingMovies = await MovieModel.find(query).countDocuments(); // total movie after filter
  }

  // const totalMovies = await MovieModel.find(query).countDocuments();
  const totalMovies = await MovieModel.find().countDocuments(); // total movie in db

  if (queryParams.limit) {
    currentPage = parseInt(queryParams.page) || 1;
    // limitPage = parseInt(queryParams.limit) || 10;
    limitPage = parseInt(queryParams.limit);
    offset = (currentPage - 1) * limitPage;

    totalPages = Math.ceil(
      (queryMatchingMovies ? queryMatchingMovies : totalMovies) / limitPage
    );
    hasPreviousPage = currentPage > 1;
    hasNextPage = currentPage < totalPages;

    if (offset > (queryMatchingMovies ? queryMatchingMovies : totalMovies)) {
      throw new BadRequestError(
        'The page number you requested is greater than the total number of available pages.'
      );
    }
  }

  // console.log('offset', offset);
  // console.log('totalPages', totalPages);

  const movieList = await MovieModel.find(query)
    .sort(sortQuery)
    .limit(limitPage)
    .skip(offset)
    .exec();

  return {
    totalMovies,
    queryMatchingMovies,
    movieList,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

const createNewMovie = async (movieData) => {
  try {
    return await movieData.save();
  } catch (error) {
    if (
      movieData.imagesCloudinaryId &&
      movieData.imagesCloudinaryId.length > 0
    ) {
      await Promise.all(
        movieData.imagesCloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    throw error;
  }
};

const updateMovieById = async (id, movieData) => {
  try {
    const movie = await MovieModel.findById(id);
    const oldImagesCloudinaryId = movie?.imagesCloudinaryId;

    const result = await MovieModel.findByIdAndUpdate(id, movieData, {
      new: true,
      runValidators: true,
    });

    if (oldImagesCloudinaryId && oldImagesCloudinaryId.length > 0) {
      await Promise.all(
        oldImagesCloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    return result;
  } catch (error) {
    if (
      movieData.imagesCloudinaryId &&
      movieData.imagesCloudinaryId.length > 0
    ) {
      await Promise.all(
        movieData.imagesCloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    throw error;
  }
};

const deleteMovieById = async (id) => {
  try {
    const movie = await MovieModel.findById(id);
    const oldImagesCloudinaryId = movie?.imagesCloudinaryId;

    const result = await MovieModel.findByIdAndDelete(id);

    if (oldImagesCloudinaryId && oldImagesCloudinaryId.length > 0) {
      await Promise.all(
        oldImagesCloudinaryId.map((id) => deleteFromCloudinary(id))
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovieById,
  deleteMovieById,
};
