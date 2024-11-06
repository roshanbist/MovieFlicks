import { NotFoundError } from './CustomError.js';

// Function to merge allowed fields from movie object with the object passed in
export const mergeAllowedFields = (obj, movie, ...allowedFields) => {
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      obj[key] = obj[key] ? JSON.parse(obj[key]) : movie[key];
    }
  });

  return obj;
};

// Function to throw custom error for invalid routes
export const invalidRouteHandler = async (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on the server`));
};
