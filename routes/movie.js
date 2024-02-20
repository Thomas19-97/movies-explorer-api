const express = require('express');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');
const { deleteMovieValidation, createMovieValidation } = require('../middlewares/validation');

const movieRouter = express.Router();
movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', createMovieValidation, createMovie);
movieRouter.delete('/movies/:movieId', deleteMovieValidation, deleteMovie);

module.exports = movieRouter;
