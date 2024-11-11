import UserModel from '../model/UserModel.js';

const changePassword = async (id, newPassword, newConfirmPassword) => {
  const user = await UserModel.findById(id);

  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;

  return await user.save();
};

const updateUserById = async () => {
  //
};

export default { changePassword, updateUserById };
