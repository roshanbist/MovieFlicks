import MovieModel from '../model/MovieModel.js';

const getAllMovies = async (queryParams) => {
  // destruct query params
  // create main query object empty
  // check if name exist then add it to the query params
  // run it by sending it to the find() as {}
  const { name, genres, sort } = queryParams;
  const query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (genres) {
    query.genres = { $in: genres.split(',') };
  }

  let sortQuery;

  if (sort) {
    sortQuery = sort.split(',').join(' ');
  }

  const totalMovies = await MovieModel.find(query).countDocuments();
  const movieList = await MovieModel.find(query).sort(sortQuery);

  return { totalMovies, movieList };
};

const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

const createNewMovie = async (movieData) => {
  return await movieData.save();
};

const updateMovieById = async (id, movieData) => {
  return await MovieModel.findByIdAndUpdate(id, movieData, {
    new: true,
    runValidators: true,
  });
};

const deleteMovieById = async (id) => {
  return await MovieModel.findByIdAndDelete(id);
};

export default {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovieById,
  deleteMovieById,
};
