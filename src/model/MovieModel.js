import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minLength: [4, 'Movie name must be at least 4 characters.'],
    maxLength: [50, 'Movie name must not be greater than 50 characters.'],
    required: [true, 'Movie name is required field.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Movie description is required field.'],
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: [true, 'Movie Release year is required field.'],
  },
  duration: {
    type: Number,
    required: [true, 'Movie Duration is required field.'],
  },
  ratings: {
    type: Number,
    required: [true, 'Movie Ratings is required field.'],
    default: 1.0,
    validate: {
      validator: function (value) {
        return value >= 1 && value <= 10;
      },
      message: 'Ratings must be between 1 and 10.',
    },
  },
  directors: {
    type: [String],
    required: [true, 'Movie Directors is required field.'],
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: 'Movie Directors cannot be empty.',
    },
  },
  actors: {
    type: [String],
    required: [true, 'Movie Actors is required field.'],
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: 'Movie Actors cannot be empty.',
    },
  },
  images: {
    type: [String],
    required: [true, 'Image is required field. Please provide movie poster'],
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: 'Movie Images cannot be empty.',
    },
  },
  genres: {
    type: [String],
    required: [true, 'Movie Genres is required field.'],
    enum: {
      values: [
        'Action',
        'Adventure',
        'Sci-Fi',
        'Thriller',
        'Crime',
        'Drama',
        'Comedy',
        'Romance',
        'Biography',
      ],
      message:
        'Invalid genre. Available genres are: Action, Adventure, Sci-Fi, Thriller, Crime, Drama, Comedy, Romance, Biography.',
    },
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: 'Genre cannot be empty',
    },
  },
  cloudinaryId: {
    type: [String],
    // required: [true, 'Movie Cloudinary Files ID is required field.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// remove image from cloudinary if creating movie failed
MovieSchema.post('save', async function (error, doc, next) {
  if (error) {
    if (doc.cloudinaryId && doc.cloudinaryId.length > 0) {
      await Promise.all(doc.cloudinaryId.map((id) => deleteFromCloudinary(id)));
    }
    next(error);
  }
});

export default mongoose.model('Movie', MovieSchema);
