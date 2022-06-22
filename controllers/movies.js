const Movie = require('../models/movie');

const DataError = require('../errors/data_error'); // 400
const AccessDeniedError = require('../errors/access_denied_error'); // 403
const NotFoundError = require('../errors/not_found_error'); // 404

// получить все карточки
const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

// через post добавили в бд
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(DataError('Данные о фильме не валидны.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => new NotFoundError('Карточка фильма не найдена'))
    .then((movie) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(movie.owner)) {
        Movie.findByIdAndRemove(_id)
          .then((result) => {
            res.send(result);
          });
      } else {
        throw new AccessDeniedError('Вы не обладаете достаточными правами для удаления карточки фильма.');
      }
    })
    .catch(next);
};

module.exports = {
  getMovie, createMovie, deleteMovie,
};
