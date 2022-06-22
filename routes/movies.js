/* eslint-disable no-useless-escape */
const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovie);

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([\/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
    trailer: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([\/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required().length(24).hex(),
  }),
}), createMovie);

movieRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = movieRouter;
