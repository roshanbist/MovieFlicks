import crypto from 'crypto';

import UserModel from '../model/UserModel.js';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import { generateHashData } from '../utils/authUtil.js';
import { ServerError } from '../utils/CustomError.js';
import { sendEmail } from '../utils/templates/email/sendEmail.js';

const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;

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

const forgotPassword = async (id) => {
  const user = await UserModel.findById(id);

  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedResetToken = generateHashData(resetToken);

  user.passwordResetToken = hashedResetToken;
  user.passwordResetTokenExpireTime = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetPasswordLink = `${CLIENT_URL}${PORT}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password reset request',
      payload: {
        name: user.name,
        link: resetPasswordLink,
      },
      template: './resetPasswordRequest.handlebars',
    });

    const message = 'Password reset link was sent successfully';
    const statusText = 'succes';

    return { message, statusText };
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpireTime = undefined;
    user.save({ validateBeforeSave: false });

    throw new ServerError(
      'Error in sending password reset email. Please try again later.'
    );
  }
};

const resetPassword = async (password, confirmPassword, id) => {
  const user = await UserModel.findById(id);

  await user.save()
};

export default {
  register,
  forgotPassword,
  resetPassword,
  findUserByUsernameOrEmail,
};
