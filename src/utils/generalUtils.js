import { NotFoundError } from './CustomError.js';

// Merge allowed fields from movie object with the object passed in
export const mergeAllowedFields = (obj, movie, ...allowedFields) => {
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      obj[key] = obj[key] ? JSON.parse(obj[key]) : movie[key];
    }
  });

  return obj;
};

// Throw custom error for invalid routes
export const invalidRouteHandler = async (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on the server`));
};

// Merge query parameter
export const mergeQueryParams = (queryParams) => {
  const { name, genres, min_duration, max_duration, sort } = queryParams;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (genres) {
    query.genres = { $in: genres.split(',') };
  }

  if (min_duration) {
    query.duration = { $gte: min_duration };
  }

  if (max_duration) {
    query.duration = { $lte: max_duration };
  }

  if (min_duration && max_duration) {
    query.duration = { $gte: min_duration, $lte: max_duration };
  }

  let sortQuery;

  if (sort) {
    sortQuery = sort.split(',').join(' ');
  }

  return { query, sortQuery };
};
