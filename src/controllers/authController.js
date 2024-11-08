import UserModel from '../model/UserModel.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
// import { hashPassword } from '../utils/authUtil.js';
import authService from '../services/authService.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/CustomError.js';
import { comparePassword } from '../utils/authUtil.js';

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
  // check if user exist with username or email
  // check if password and confirm password match
  // compare user entered password and db saved password
  // if match then send the user to generate token
  // return user with token, access token, user detail and message using cookie
  const { username, password, confirmPassword } = req.body;

  const user = await authService.findUserByUsernameOrEmail(username);
  console.log('user', user);

  if (!user) {
    return next(
      new NotFoundError(`User not found. Please enter correct credentials.`)
    );
  }

  if (password !== confirmPassword) {
    return next(
      new BadRequestError('Password and confirm password did not match')
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
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //
});
