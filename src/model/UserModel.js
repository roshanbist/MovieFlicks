import mongoose from 'mongoose';
import validator from 'validator';

import { generateHashData } from '../utils/authUtil.js';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Name must be at least 2 characters.'],
    maxLength: [30, 'Name must be at most 30 characters.'],
    required: [true, 'Name is a required field.'],
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [5, 'Username must be at least 5 characters.'],
    maxLength: [20, 'Username must be at most 20 characters.'],
    required: [true, 'Username is a required field.'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'Email is a required field.'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is a required field.'],
    minLength: [6, 'Password must be at least 6 characters.'],
    select: false,
    trim: true,
  },
  confirmPassword: {
    type: String,
    trim: true,
    required: [true, 'Confirm Password is a required field.'],
    validate: {
      validator: function (pwd) {
        return this.password === pwd;
      },
      message: 'Password and confirm password did not match.',
    },
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is a required field.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatarCloudinaryId: {
    type: String,
    required: [true, 'CloudinaryId is a required field'],
  },
  refreshToken: {
    type: String,
    select: false,
  },
  passwordResetToken: String,
  passwordResetTokenExpireTime: Date,
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = generateHashData(this.password);
  this.confirmPassword = undefined;
  next();
});

export default mongoose.model('User', UserSchema);
