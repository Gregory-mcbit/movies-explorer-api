const routerUsers = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  createUser, login, getMe, updateMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

// Роуты регистрации и авторизации
routerUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Email не в корректном формате');
    }),
    password: Joi.string().required(),
  }),
}), createUser);
routerUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Роуты защищенные авторизацией
// User routes
routerUsers.use(auth);
routerUsers.get('/users/me', getMe);
routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateMe);

module.exports = routerUsers;
