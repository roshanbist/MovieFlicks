import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minLength: [4, 'Movie name must be at least 4 characters.'],
    maxLength: [50, 'Movie name must not be greater than 50 characters.'],
    required: [true, 'Movie name is required field.'],
  },
  description: {
    type: String,
    required: [true, 'Movie description is required field.'],
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
      message: 'Ratings must be between 1 and 10',
    },
  },
  directors: {
    type: [String],
    required: [true, 'Movie Directors is required field.'],
  },
  actors: {
    type: [String],
    required: [true, 'Movie Actors is required field.'],
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Movie', MovieSchema);
