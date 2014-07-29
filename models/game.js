var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Bought is a dictionary in the form:
 * {
 * 	Stock ID: Number
 * }
 */
var gameSchema = new Schema({
	companyName: String,
	companyId: String,
	balance: { type: Number, default: 10000 },
	shares: { type: Number, default: 1000 },
	bought: { type: {}, default: {} },
	day: { type: Date, default: '1/1/2004' }
});

module.exports = exports = mongoose.model('Game', gameSchema);
