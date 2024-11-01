export const errorHandlingMiddleware = async (error, req, res, next) => {
  const statusCode = error.status || 500;
  const message =
    error.message || 'Internal Server Error occured. Please try again';

  //
  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode <= 499 ? 'fail' : 'error',
    message: message,
  });
};
