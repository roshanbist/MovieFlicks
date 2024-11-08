import UserModel from '../model/UserModel.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';

const register = async (data) => {
  try {
    const user = await data.save();
    return user;
  } catch (error) {
    if (data.avatarCloudinaryId) {
      await deleteFromCloudinary(data.avatarCloudinaryId);
    }
    throw error;
  }
};

const findUserByUsernameOrEmail = async (indentifier) => {
  return await UserModel.findOne({
    $or: [{ username: indentifier }, { email: indentifier }],
  }).select('+password');
};

const login = async () => {
  //
};

const forgotPassword = async () => {
  //
};

const resetPassword = async () => {
  //
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  findUserByUsernameOrEmail,
};
