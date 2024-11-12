import jwt from 'jsonwebtoken';

import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { NotFoundError, UnauthorizedError } from '../utils/CustomError.js';
import UserModel from '../model/UserModel.js';

export const authMiddleware = asyncErrorHandler(async (req, res, next) => {
  const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(
      new UnauthorizedError('User not logged in, Please login first.')
    );
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, async function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(
          new UnauthorizedError(
            'Token has already expired. Please login again.'
          )
        );
      }

      if (err.name === 'JsonWebTokenError') {
        return next(
          new UnauthorizedError('Invalid Token. Please login again.')
        );
      }

      return next(
        new UnauthorizedError('Authorization failed. Please try again.')
      );
    }

    const user = await UserModel.findById(decoded.user.id);

    if (!user) {
      return next(new NotFoundError('User not found. Please login again.'));
    }

    req.user = user;
    next();
  });
});
