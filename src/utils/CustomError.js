export class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(
    message = 'The request could not be understood by the server. Please check your request'
  ) {
    super(400, message);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(
    message = 'Authentication is required and has failed or has not yet been provided.'
  ) {
    super(401, message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(
    message = 'You do not have permission to access the requested resource.'
  ) {
    super(403, message);
  }
}

export class NotFoundError extends CustomError {
  constructor(
    message = 'The requested resource could not be found on the server.'
  ) {
    super(404, message);
  }
}

export class ServerError extends CustomError {
  constructor(
    message = 'An unexpected error occurred on the server. Please try again later.'
  ) {
    super(500, message);
  }
}
