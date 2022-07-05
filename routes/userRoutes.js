const express = require('express');
const userController = require('../controllers/userController');
const user = require('../models/user');
const router = express.Router();
const {isGuest, authenticate} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');
const { validationResult } = require('express-validator');

router.get('/new', isGuest, userController.new);

router.post('/', isGuest, validateSignUp, validateResult, userController.create);

router.get('/login', isGuest, userController.login);

router.post('/login', logInLimiter,isGuest, validateLogIn, userController.authenticate);

router.get('/profile', authenticate, userController.profile);

router.get('/logout', authenticate, userController.logout);

module.exports = router;