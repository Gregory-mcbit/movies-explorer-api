const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const isAuthorized = require('../helpers/isAuthorized');
const NotFoundError = require('../errors/not_found_error');
const BadRequestError = require('../errors/data_error');
const UnauthorizedError = require('../errors/auth_error');
const ForbiddenError = require('../errors/access_denied_error');
const ConflictError = require('../errors/conflict_error');
const { JWT_SECRET } = require('../config');

const getMe = (req, res, next) => {
  const token = req.headers.authorization;

  if (!isAuthorized(token)) {
    throw new ForbiddenError('Доступ запрещен');
  }

  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const updateMe = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  return User.findByIdAndUpdate(owner, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильная почта или пароль');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, password, email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, password: hash, email,
    }))
    .then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Данные не прошли валидацию');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Такой емейл уже зарегистрирован');
      }
    })
    .catch(next);
};

module.exports = {
  createUser, login, getMe, updateMe,
};
