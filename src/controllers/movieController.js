import MovieModel from '../model/MovieModel.js';
import movieService from '../services/movieService.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { BadRequestError, NotFoundError } from '../utils/CustomError.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';
import { mergeAllowedFields } from '../utils/generalUtils.js';

export const getAllMovies = asyncErrorHandler(async (req, res, _) => {
  const {
    totalMovies,
    queryMatchingMovies,
    movieList,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = await movieService.getAllMovies(req.query);

  res.status(200).json({
    status: 'success',
    message:
      totalMovies > 0 ? 'All movies retrieved successfully' : 'No movies found',
    totalMovies: totalMovies,
    queryMatchingMovies: queryMatchingMovies,
    totalPages: totalPages,
    hasPreviousPage: hasPreviousPage,
    hasNextPage: hasNextPage,
    data: movieList,
  });
});

export const getMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.id;

  const movie = await movieService.getMovieById(movieId);

  if (!movie) {
    return next(new NotFoundError(`Movie with id: ${movieId} does not exist.`));
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
        'Movie images are missing. Upload at least one image to proceed.'
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
    actors: req.body.actors ? JSON.parse(req.body.actors) : [],
    genres: req.body.genres ? JSON.parse(req.body.genres) : [],
    imagesCloudinaryId: filesCloudinaryId,
  });

  const newMovie = await movieService.createNewMovie(movieData);

  res.status(201).json({
    status: 'success',
    message: 'Movie created successfully',
    data: newMovie,
  });
});

export const updateMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.id;
  const incomingMovieData = { ...req.body };

  const movie = await MovieModel.findById(movieId);

  if (!movie) {
    return next(new NotFoundError(`Movie with id ${movieId} does not exist.`));
  }

  if (req.files && req.files.length > 0) {
    const { uploadedFilesUrl, filesCloudinaryId } = await uploadFileGetUrls(
      req.files
    );
    incomingMovieData.images = uploadedFilesUrl;
    incomingMovieData.imagesCloudinaryId = filesCloudinaryId;
  }

  const movieDataToUpdate = mergeAllowedFields(
    incomingMovieData,
    movie,
    'actors',
    'genres'
  );

  const updatedMovie = await movieService.updateMovieById(
    movieId,
    movieDataToUpdate
  );

  res.status(200).json({
    status: 'success',
    data: updatedMovie,
    message: 'Movie updated successfully',
  });
});

export const deleteMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieId = req.params.id;

  const movie = await movieService.getMovieById(movieId);

  if (!movie) {
    return next(new NotFoundError(`Movie with id: ${movieId} not found.`));
  }

  await movieService.deleteMovieById(movieId);

  res.status(200).json({
    status: 'success',
    message: 'Movie deleted successfully',
  });
});
