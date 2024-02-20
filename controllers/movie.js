const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res
        .status(201)
        .send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(error);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const ownerId = req.user._id;
  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id фильма');
    })
    .then((movie) => {
      if (!movie.owner.equals(ownerId)) {
        throw new ForbiddenError('Невозможно удалить чужой фильм');
      }
      Movie.deleteOne(movie)
        .then(() => {
          res.status(200).send(movie);
        })
        .catch(next);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления фильма'));
      } else {
        next(error);
      }
    });
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
