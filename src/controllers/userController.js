import UserModel from '../model/UserModel.js';
import userService from '../services/userService.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { compareHashData } from '../utils/authUtil.js';
import { BadRequestError, UnauthorizedError } from '../utils/CustomError.js';

export const loggedUserPayload = async (req) => {
  const userPayload = req.user;

  if (!userPayload) {
    throw new UnauthorizedError('User not found. Please login.');
  }

  return userPayload;
};

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  //
});

export const getUserById = asyncErrorHandler(async (req, res, next) => {
  //
});

export const updateUserById = asyncErrorHandler(async (req, res, next) => {
  // get information from req body and id from req.params.id
  // check if user is present or not
  // for changing password there is another route but can be changed here too but we will prefer other route
  // pass the information to the services
  // run the validator there in new : true as well
});

export const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const user = await UserModel.findById(req.user._id).select('+password');

  if (!user) {
    return next(new UnauthorizedError('User not found. Please login.'));
  }

  if (password !== confirmPassword) {
    return next(
      new BadRequestError('Password and Confirm password did not match.')
    );
  }

  if (await compareHashData(req.body.password, user.password)) {
    return next(
      new BadRequestError(
        'New password is same as old password. Please enter different password.'
      )
    );
  }

  await userService.changePassword(user._id, password, confirmPassword);

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});

export const deleteUserById = asyncErrorHandler(async (req, res, next) => {
  //
});
