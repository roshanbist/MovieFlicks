import UserModel from '../model/UserModel.js';
import userService from '../services/userService.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { compareHashData } from '../utils/authUtil.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/CustomError.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';
import { filterObjData } from '../utils/generalUtils.js';

export const loggedUserPayload = async (req) => {
  const userPayload = req.user;

  if (!userPayload) {
    throw new UnauthorizedError('User not found. Please login.');
  }

  return userPayload;
};

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const { totalUsers, users } = await UserModel.getAllUsers();

  res.status(200).json({
    status: 'success',
    message: 'All users retrieved successfully.',
    totalUsers: totalUsers,
    data: users,
  });
});

export const getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return next(new NotFoundError('User with this id does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully.',
    data: user,
  });
});

export const updateUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(
      new NotFoundError('Invalid user ID. User with this id does not exist.')
    );
  }

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new BadRequestError('Updating password is done through another endpoint')
    );
  }

  const incomingUserData = { ...req.body };

  if (req.file) {
    const { public_id, url } = await uploadFileGetUrls(req.file);
    incomingUserData.avatar = url;
    incomingUserData.avatarCloudinaryId = public_id;
  }

  const filterData = filterObjData(
    incomingUserData,
    'name',
    'username',
    'email',
    'avatar',
    'avatarCloudinaryId'
  );

  const updatedUser = await userService.updateUserById(
    req.params.id,
    filterData
  );

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: updatedUser,
  });
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
