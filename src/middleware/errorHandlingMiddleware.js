import { BadRequestError } from '../utils/CustomError.js';

const developmentErrorHandler = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
  });
};

const productionErrorHandler = (res, error) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const validationErrorHandler = (error) => {
  const errMessage = Object.values(error.errors)
    .map((err) => err.message)
    .join(' ');

  return new BadRequestError(`Invalid input data: ${errMessage}`);
};

const duplicateErrorHandler = (error) => {
  const key = Object.keys(error.keyValue).join('');
  const value = error.keyValue[key];

  const errMessage = `${
    key.charAt(0).toUpperCase() + key.slice(1)
  } ${value} already exist. Please use another.`;

  return new BadRequestError(`Duplicate data: ${errMessage}`);
};

const castErrorHandler = (error) => {
  const message = `Invalid value for ${error.path}: ${error.value}`;

  return new BadRequestError(`Duplicate data: ${message}`);
};

export const errorHandlingMiddleware = async (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentErrorHandler(res, error);
  }

  if (process.env.NODE_ENV === 'production') {
    // validation error
    if (error.name === 'ValidationError') {
      error = validationErrorHandler(error);
    }

    // duplicate error
    if (error.code === 11000) {
      error = duplicateErrorHandler(error);
    }

    if (error.name === 'CastError') {
      error = castErrorHandler(error);
    }

    productionErrorHandler(res, error);
  }
};
