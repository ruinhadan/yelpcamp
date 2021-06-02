const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')
const router = express.Router({ mergeParams: true });

const users = require('../controllers/users')

router.route('/register')
        .get(users.renderRegisterForm)
        .post(catchAsync(users.registerUser))

router.route('/login')
        .get(users.renderLoginForm)
        .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login))

router.get('/logout', users.logout)

module.exports = router;