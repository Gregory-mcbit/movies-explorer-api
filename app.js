require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/movies');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/err_logger');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not_found_error'); // 404

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: [
    'https://mnogomovies.nomoredomains.xyz',
    'http://mnogomovies.nomoredomains.xyz',
    'https://51.250.99.197',
    'https://localhost:3000',
  ],
  credentials: true,
};

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);

app.use(cors(corsOptions));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardsRouter);
app.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Упс, похоже на ошибку сервера.' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server is run at ${PORT}`);
});
