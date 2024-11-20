import crypto from 'crypto';

import UserModel from '../model/UserModel.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import authService from '../services/authService.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/CustomError.js';
import {
  compareHashData,
  generateAccessAndRefreshToken,
  verifyRefreshToken,
} from '../utils/authUtil.js';
import { cookieConfigOption } from '../config/constants.js';
import { filterObjData } from '../utils/generalUtils.js';

export const register = asyncErrorHandler(async (req, res, next) => {
  if (!req.file) {
    return next(
      new BadRequestError('User avatar is missing. Please upload valid image.')
    );
  }

  const { public_id, url } = await uploadFileGetUrls(req.file);

  if (!public_id) {
    return next(new BadRequestError('Image not uploaded. Please try again.'));
  }

  const userData = new UserModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    avatar: url,
    avatarCloudinaryId: public_id,
  });

  const user = await authService.register(userData);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: user,
  });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;

  if (
    [username, password, confirmPassword].some((field) => field?.trim() === '')
  ) {
    return next(new BadRequestError('Incomplete user login data.'));
  }

  if (password !== confirmPassword) {
    return next(
      new BadRequestError(
        'Password and confirm password did not match. Please try again.'
      )
    );
  }

  const user = await authService.findUserByUsernameOrEmail(username);

  if (!user) {
    return next(
      new NotFoundError(`User not found. Please enter correct credentials.`)
    );
  }

  const matchPassword = await compareHashData(password, user.password);

  if (!matchPassword) {
    return next(
      new UnauthorizedError(
        'Password did not match. Please enter correct password'
      )
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id
  );

  const loggedUser = await UserModel.findById(user._id);

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieConfigOption)
    .cookie('refreshToken', refreshToken, cookieConfigOption)
    .json({
      status: 'success',
      message: 'User logged in successfully.',
      accessToken: accessToken,
      data: loggedUser,
    });
});

export const logout = asyncErrorHandler(async (req, res, _) => {
  const user = await UserModel.findById(req.user._id);

  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .clearCookie('accessToken', cookieConfigOption)
    .clearCookie('refreshToken', cookieConfigOption)
    .json({
      status: 'success',
      message: 'user logged out successfully',
      data: null,
    });
});

export const refreshAccessToken = asyncErrorHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return next(
      new UnauthorizedError(
        'Refresh token not found. Please login to continue.'
      )
    );
  }

  const decodedToken = await verifyRefreshToken(incomingRefreshToken);

  const user = await UserModel.findById(decodedToken.user.id).select(
    '+refreshToken'
  );

  if (incomingRefreshToken !== user.refreshToken) {
    return next(
      new UnauthorizedError(
        'Invalid or expired refresh token. Please log in again.'
      )
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieConfigOption)
    .cookie('refreshToken', refreshToken, cookieConfigOption)
    .json({
      status: 'success',
      message: 'Access Token refresh successfully',
      accessToken: accessToken,
    });
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { username } = req.body;

  const user = await authService.findUserByUsernameOrEmail(username);

  if (!user) {
    return next(
      new BadRequestError(
        'User does not exist. Please enter valid username or email.'
      )
    );
  }

  const result = await authService.forgotPassword(user._id);

  res.status(200).json(result);
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(
      new BadRequestError('Password and confirm password did not match.')
    );
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpireTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new NotFoundError(
        'User not found. Token is either invalid or has expired. Please try again.'
      )
    );
  }

  const result = await authService.resetPassword(
    password,
    confirmPassword,
    user._id
  );

  res.status(200).json(result);
});
