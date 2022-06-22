const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
  }),
}), updateUser);

module.exports = userRouter;
