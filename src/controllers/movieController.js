import MovieModel from '../model/MovieModel.js';
import movieService from '../services/movieService.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import { BadRequestError, NotFoundError } from '../utils/CustomError.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';

export const getAllMovies = asyncErrorHandler(async (req, res, next) => {
  const movieList = await movieService.getAllMovies();

  //
  res.status(200).json({
    status: 'success',
    message: 'All movies retrieved successfully',
    data: movieList,
  });
});

export const getMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.id;

  const movie = await movieService.getMovieById(movieId);

  if (!movie) {
    return next(new NotFoundError(`Movie with id: ${movieId} not found.`));
  }

  res.status(200).json({
    status: 'success',
    message: 'Movie retrieved successfully',
    data: movie,
  });
});

export const createNewMovie = asyncErrorHandler(async (req, res, next) => {
  if (!req.files.length > 0) {
    return next(
      new BadRequestError(
        'Movie images are missing. Please upload at least one image to proceed.'
      )
    );
  }

  const { uploadedFilesUrl, filesCloudinaryId } = await uploadFileGetUrls(
    req.files
  );

  if (!uploadedFilesUrl.length > 0) {
    return next(new BadRequestError('Invalid movie image. Please try again.'));
  }

  const movieData = new MovieModel({
    ...req.body,
    images: uploadedFilesUrl,
    directors: req.body.directors ? JSON.parse(req.body.directors) : [],
    actors: req.body.actors ? JSON.parse(req.body.actors) : [],
    genres: req.body.directors ? JSON.parse(req.body.genres) : [],
    cloudinaryId: filesCloudinaryId,
  });

  const newMovie = await movieService.createNewMovie(movieData);

  res.status(201).json({
    status: 'success',
    message: 'Movie created successfully',
    data: newMovie,
  });
});

export const updateMovieById = async (req, res, next) => {
  //
};

export const deleteMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.id;

  const movie = await movieService.getMovieById(movieId);

  if (!movie) {
    return next(new NotFoundError(`Movie with id: ${movieId} not found.`));
  }

  if (movie.cloudinaryId && movie.cloudinaryId.length > 0) {
    await Promise.all(movie.cloudinaryId.map((id) => deleteFromCloudinary(id)));
  }

  await movieService.deleteMovieById(movieId);

  res.status(200).json({
    status: 'success',
    message: 'Movie deleted successfully',
  });
});
