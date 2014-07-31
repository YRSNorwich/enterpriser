var passport = require('passport');
var loginManager = require('../lib/login-manager.js');
var passportLocal = require('passport-local');

var LocalStrategy = passportLocal.Strategy;
var strategy = new LocalStrategy(loginManager.handleLogin);

passport.use(strategy);

var routes = {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
};

exports.login = passport.authenticate('local', routes);

function failRegistration (req, res, message) {
	req.flash('registrationError', message);
	res.redirect('/');
}

exports.register = function(req, res) {
	if (req.param('username') && req.param('email') && req.param('password')) {
		loginManager.handleRegistration(
			req.param('username'),
			req.param('email'),
			req.param('password'),
			function(error, user, failureMessage) {
				if (error) {
					failRegistration(req, res, 'There was an error when processing your request! Sowwy :(');
				} else if (user) {
					res.redirect('/');
				} else {
					failRegistration(req, res, failureMessage);
				}
			}
		)
	} else {
		failRegistration(req, res, 'Please enter all the credentials necessary to register!');
	}
}

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
}
