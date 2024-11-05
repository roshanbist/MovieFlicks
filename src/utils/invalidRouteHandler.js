import { NotFoundError } from './CustomError.js';

export const invalidRouteHandler = async (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on the server`));
};
