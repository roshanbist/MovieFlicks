import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../model/UserModel.js';
import { UnauthorizedError } from './CustomError.js';

export const hashPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (plainPassword, encryptPassword) => {
  return await bcrypt.compare(plainPassword, encryptPassword);
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

  // save refreshToken in user document and then to db
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token) => {
  const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

  return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, function (err, decoded) {
    if (err) {
      // TODO: error.name change garnu paryo like verifyJWTTOken
      throw new UnauthorizedError('Invalid refresh token.');
    }

    return decoded;
  });
};
