import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { ForbiddenError } from '../utils/CustomError.js';

export const authorizeAdmin = asyncErrorHandler(async (req, _, next) => {
  if (req.user?.role !== 'admin') {
    return next(
      new ForbiddenError(
        'You do not have permission to access the requested resource.'
      )
    );
  }

  next();
});
