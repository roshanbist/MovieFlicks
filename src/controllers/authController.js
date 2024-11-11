import UserModel from '../model/UserModel.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import authService from '../services/authService.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '../utils/CustomError.js';
import {
  compareHashData,
  generateAccessAndRefreshToken,
  generateHashData,
  verifyRefreshToken,
} from '../utils/authUtil.js';
import { cookieConfigOption } from '../config/constants.js';
import { sendEmail } from '../utils/templates/email/sendEmail.js';

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
  const { username } = req.body;

  const user = await authService.findUserByUsernameOrEmail(username);

  if (!user) {
    return next(
      new BadRequestError(
        'User does not exist. Please enter valid username or email.'
      )
    );
  }

  const { message, statusText } = await authService.forgotPassword(user._id);

  res.status(200).json({
    status: statusText,
    message: message,
  });
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  // get token, confirm password, password
  // convert token to hash token using bcyrpt
  // find the user based on the token and passwordResetTokenExpireTime using findOne
  // user exist then compare password and confirm password
  // if not throw error
  // if no match throw error
  // if match set new password after hashing
  // set password token and rexpire time undefined with confirm password undefined
  // send email to user with message of password change successfully

  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(
      new BadRequestError('Password and confirm password did not match.')
    );
  }

  const hashedToken = generateHashData(token);

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

  const newPassword = await authService.resetPassword(
    password,
    confirmPassword,
    user._id
  );
});
