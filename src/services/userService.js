import UserModel from '../model/UserModel.js';

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
  return await UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export default { getAllUsers, getUserById, changePassword, updateUserById };
