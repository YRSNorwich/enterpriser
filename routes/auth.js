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
