var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = require('./game');

var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	games: [Schema.ObjectId]
});

module.exports = exports = mongoose.model('User', userSchema);
