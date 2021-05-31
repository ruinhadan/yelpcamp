const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')
const router = express.Router({ mergeParams: true });
const passport = require('passport');

router.get('/register', (req, res) => {
        res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
        try {
                const { username, email, password } = req.body;
                const user = new User({ username, email })
                const regUser = await User.register(user, password)
                req.login(regUser, err => {
                        if (err) return next(err);
                        req.flash('success', 'Welcome to YelpCamp')
                        res.redirect('/campgrounds')
                })

        } catch (e) {
                req.flash('error', e.message);
                res.redirect('/register');
        }
}))

router.get('/login', (req, res) => {
        res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res, next) => {
        const redirectUrl = req.session.returnTo || '/campgrounds';
        req.flash('success', 'Welcome Back!')
        delete req.session.returnTo
        res.redirect(redirectUrl)
}))

router.get('/logout', (req, res) => {
        req.logout();
        req.flash('success', 'Sayounara')
        res.redirect('/campgrounds')
})

module.exports = router;