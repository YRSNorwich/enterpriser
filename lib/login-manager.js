var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var validator = require('validator');

var User = require('../models/user');

var INCORRECT_CREDENTIALS_MESSAGE = 'Incorrect credentials!';
var INVALID_USERNAME_MESSAGE = 'Usernames must only contain letters and numbers!';
var INVALID_EMAIL_MESSAGE = 'Email must be valid!';
var INVALID_PASSWORD_MESSAGE = 'Password must only contain ASCII characters!'
var CLAIMED_USERNAME_MESSAGE = 'This username is already taken!';
var CLAIMED_EMAIL_MESSAGE = 'This email is already in use!';

exports.handleLogin = function (username, password, done)
{
	username = username.trim();
	User.findOne({ 'username': username }, function (error, doc) {
		if (doc)
		{
			if (error) return done(error);
			bcrypt.compare(password, doc.password, function (error, correct) {
				if (error)
				{
					if (error) return done(error);
				}
				else
				{
					if (correct)
					{
						return done(null, doc);
					}
					else
					{
						return done(null, false, { message: INCORRECT_CREDENTIALS_MESSAGE });
					}
				}
			})
		}
		else
		{
			done(null, false, { message: INCORRECT_CREDENTIALS_MESSAGE });
		}
	})
}

exports.handleRegistration = function (username, email, password, done)
{
	username = username.trim();
	email = email.trim();

	if (!validator.isAlphanumeric(username))
	{
		return done(null, false, INVALID_USERNAME_MESSAGE);
	}

	if (!validator.isEmail(email))
	{
		return done(null, false, INVALID_EMAIL_MESSAGE);
	}

	if (!validator.isAscii(password))
	{
		return done(null, false, INVALID_PASSWORD_MESSAGE);
	}

	User.findOne({ 'username': username }, function (error, doc) {
		if (error) return done(error);
		if (doc) return done(null, false, CLAIMED_USERNAME_MESSAGE);
		User.findOne({ 'email': email }, function (error, doc) {
			if (error) return done(error);
			if (doc) return done(null, false, CLAIMED_EMAIL_MESSAGE);
			bcrypt.hash(password, null, null, function (error, hashedPassword) {
				if (error) return done(error);
				User.create({ 'username': username, 'password': hashedPassword, 'email': email }, function (error, user) {
					if (error) return done(error);
					user.save();
					return done(null, user);
				})
			})
		})
	})
}
