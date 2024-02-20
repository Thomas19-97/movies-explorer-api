const router = require('express').Router();
const auth = require('../middlewares/auth');
const { userRouter } = require('./users');
const { movieRouter } = require('./movie');
const { createUser, login } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validation');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.use(userRouter);
router.use(movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
