import UserModel from '../model/UserModel.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
// import { hashPassword } from '../utils/authUtil.js';
import authService from '../services/authService.js';
import { uploadFileGetUrls } from '../utils/fileUploadUtils.js';

export const register = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.file);

  if (req.file) {
    console.log('hi');
    // console.log(req.file.length);
    // const { uploadedFilesUrl, filesCloudinaryId } = await uploadFileGetUrls(
    //   req.file
    // );
    // req.body.avatar = uploadedFilesUrl;
    // req.body.cloudinaryId = filesCloudinaryId;
  }

  console.log(req.body);

  // const userData = new UserModel(req.body);
  // const user = await authService.register(userData);

  // console.log('user', user);

  // res.status(201).json({
  //   status: 'success',
  //   message: 'User registered successfully',
  //   data: user,
  // });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  //
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //
});
