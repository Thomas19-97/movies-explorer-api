const express = require('express');
const { updateInfo, getCurrentUserInfo } = require('../controllers/users');
const { updateInfoValidation } = require('../middlewares/validation');

const userRouter = express.Router();
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.patch('/users/me', updateInfoValidation, updateInfo);
module.exports = { userRouter };
