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
  comparePassword,
  generateAccessAndRefreshToken,
  verifyRefreshToken,
} from '../utils/authUtil.js';
import { cookieConfigOption } from '../config/constants.js';

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
    ...req.body,
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

  const matchPassword = await comparePassword(password, user.password);

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
      // refreshToken: refreshToken,
      data: loggedUser,
    });
});

export const logout = asyncErrorHandler(async (req, res, next) => {
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

  // res.send('working');
});

export const refreshAccessToken = asyncErrorHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new UnauthorizedError('User not authorized.'));
  }

  const decodedToken = await verifyRefreshToken(incomingRefreshToken);

  const user = await UserModel.findById(decodedToken.user.id);

  if (incomingRefreshToken !== user.refreshToken) {
    return next(
      new UnauthorizedError('Refresh token has expired or already used.')
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
      refreshToken: refreshToken,
    });

  res.send('testing');
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //
});
