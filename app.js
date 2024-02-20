require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, NODE_ENV, MONGO_URL } = process.env;
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes');
const { centralErrorHandler } = require('./errors/centralErrorHandler');

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
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
