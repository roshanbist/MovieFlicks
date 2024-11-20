import UserModel from '../model/UserModel.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';

const getAllUsers = async () => {
  const totalUsers = await UserModel.find().countDocuments();
  const users = await UserModel.find();

  return { totalUsers, users };
};

const getUserById = async (id) => {
  return await UserModel.findById(id);
};

const changePassword = async (id, newPassword, newConfirmPassword) => {
  const user = await UserModel.findById(id);

  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;

  return await user.save();
};

const updateUserById = async (id, data) => {
  try {
    let oldAvatarCloudinaryId;
    const user = await UserModel.findById(id);

    if (data.avatarCloudinaryId) {
      oldAvatarCloudinaryId = user?.avatarCloudinaryId;
    }

    const result = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (oldAvatarCloudinaryId) {
      await deleteFromCloudinary(oldAvatarCloudinaryId);
    }

    return result;
  } catch (error) {
    if (data.avatarCloudinaryId) {
      await deleteFromCloudinary(data.avatarCloudinaryId);
    }
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await UserModel.findById(id);
    const oldAvatarCloudinaryId = user?.avatarCloudinaryId;

    const result = await UserModel.findByIdAndDelete(id);

    if (oldAvatarCloudinaryId) {
      await deleteFromCloudinary(oldAvatarCloudinaryId);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  changePassword,
  updateUserById,
  deleteUserById,
};
