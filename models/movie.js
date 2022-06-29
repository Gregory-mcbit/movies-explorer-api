const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
  director: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле обязательное'],
  },
  year: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
  description: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
  image: {
    type: String,
    required: [true, 'Поле обязательное'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Формат должен быть ссылкой',
    },
  },
  trailer: {
    type: String,
    required: [true, 'Поле обязательное'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Формат должен быть ссылкой',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле обязательное'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Формат должен быть ссылкой',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле обязательное'],
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: [true, 'Поле обязательное'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
