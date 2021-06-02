const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
        res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
        res.render('users/login')
}

module.exports.login = async (req, res, next) => {
        const redirectUrl = req.session.returnTo || '/campgrounds';
        req.flash('success', 'Welcome Back!')
        delete req.session.returnTo
        res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
        req.logout();
        req.flash('success', 'Sayounara')
        res.redirect('/campgrounds')
}