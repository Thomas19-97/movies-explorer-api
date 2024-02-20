require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundError');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const movieRouter = require('./routes/movie');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(rateLimiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use(userRouter);
app.use(movieRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});
app.use(errorLogger);
app.use(errors());
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });

  next();
});
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
