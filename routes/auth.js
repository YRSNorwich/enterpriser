var passport = require('passport');
var loginManager = require('../lib/login-manager.js');
var passportLocal = require('passport-local');

var LocalStrategy = passportLocal.Strategy;
var strategy = new LocalStrategy(loginManager.handleLogin);

passport.use(strategy);

var routes = {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
};

exports.login = passport.authenticate('local', routes);

function failRegistration (req, res, message)
{
	req.flash('registrationError', message);
	res.redirect('/register');
}

exports.register = function (req, res)
{
	if (req.param('username') && req.param('email') && req.param('password'))
	{
		loginManager.handleRegistration
		(
			req.param('username'),
			req.param('email'),
			req.param('password'),
			function (error, user, failureMessage)
			{
				if (error)
				{
					failRegistration(req, res, 'There was an error when processing your request! Sowwy :(');
				}
				else if (user)
				{
					res.redirect('/');
				}
				else
				{
					failRegistration(req, res, failureMessage);
				}
			}
		)
	}
	else
	{
		failRegistration(req, res, 'Please enter all the credentials necessary to register!');
	}
}

exports.loginForm = function (req, res)
{
	var loginError = req.flash('error');
	loginError = loginError === undefined ? undefined : loginError[0];
	res.render('login', { loginError: loginError });
}

exports.registrationForm = function (req, res)
{
	res.render('register', { registrationError: req.flash('registrationError') });
}
