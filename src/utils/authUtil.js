import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../model/UserModel.js';
import { UnauthorizedError } from './CustomError.js';

export const generateHashData = (data) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(data, salt);
};

export const compareHashData = async (plainData, hashedData) => {
  return await bcrypt.compare(plainData, hashedData);
};

export const generateAccessAndRefreshToken = async (id) => {
  const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
  const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

  const user = await UserModel.findById(id);

  if (!user) {
    throw new UnauthorizedError('User not found Please login first.');
  }

  const accessToken = jwt.sign(
    {
      user: {
        id: user?._id,
        email: user?.email,
      },
    },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: '20m' }
  );

  const refreshToken = jwt.sign(
    {
      user: {
        id: user?._id,
      },
    },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '1d' }
  );

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token) => {
  const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

  return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(
          new UnauthorizedError('Refresh Token has expired. Please login.')
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

    return decoded;
  });
};
