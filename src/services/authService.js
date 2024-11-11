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

  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

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

    return {
      message: 'Password reset link was sent successfully',
      status: 'success',
    };
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpireTime = undefined;
    user.save({ validateBeforeSave: false });

    throw new ServerError(
      'Error in sending password reset email. Please try again later.'
    );
  }
};

const resetPassword = async (newPassword, newConfirmPassword, id) => {
  const user = await UserModel.findById(id);

  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireTime = undefined;

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset successfully',
      payload: {
        name: user.name,
      },
      template: './resetPassword.handlebars',
    });

    return {
      message: 'Password reset was successful.',
      status: 'success',
    };
  } catch (error) {
    throw new ServerError(
      'Error in reseting the password. Please try again later.'
    );
  }
};

export default {
  register,
  forgotPassword,
  resetPassword,
  findUserByUsernameOrEmail,
};
