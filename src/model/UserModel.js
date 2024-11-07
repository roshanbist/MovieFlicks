import mongoose from 'mongoose';
import validator from 'validator';

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
    validate: [validator.isEmail(value), 'Please enter a valid email'],
  },
  password: {
    type: String,
    trim: true,
    minLength: [6, 'Password must be at least 6 characters.'],
    required: [true, 'Password is a required field.'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is a required field.'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password and confirm password did not match.',
    },
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is a required field.'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export default mongoose.model('User', UserSchema);
