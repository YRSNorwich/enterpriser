var fs = require('fs');
var mongoose = require('mongoose');

exports.giveJson = function(req, res) {
	if (req.session.passport.user)
	{
		var id = parseInt(req.param('id'));

		if (id === NaN) {
			res.json({ error: 'Invalid ID! (not a number)' });
			return;
		}

		var User = mongoose.model('User');
		User.findById(req.session.passport.user, function(error, user) {
			if (error) {
				res.json({ error: 'Error connecting to the database! :O' });
				return;
			}

			if (id < user.games.length && id >= 0) {
				var Game = mongoose.model('Game');
				Game.findById(user.games[id], function(error, game) {
					if (error)
					{
						res.json({ error: 'Error connecting to the database! :O' });
						return;
					}

					res.json(game);
				})
			}
		})
	} else {
		res.json({ error: 'You are not logged in!' });
	}
}

exports.receiveJson = function(req, res) {
	if (req.session.passport.user) {
		var id = parseInt(req.param('id'));

		if (id === NaN) {
			res.json({ error: 'Invalid ID! (not a number)' });
			return;
		}

		var User = mongoose.model('User');
		User.findById(req.session.passport.user, function(error, user) {
			if (error) {
				res.json({ error: 'Error connecting to the database! :O' });
				return;
			}

			if (id < user.games.length && id >= 0) {
				var Game = mongoose.model('Game');
				console.log(req.body);
				Game.update({ _id: user.games[id] }, req.body, function(error, game) {
					if (error) {
						res.json({ error: 'Error connecting to the database, or your JSON is funky? :O' });
						return;
					}

					res.json({ done: 'Updated state!' });
				})
			}
		})
	} else {
		res.json({ error: 'You are not logged in!' });
	}
}

exports.newGame = function(req, res) {
	if (req.session.passport.user) {
		if (!req.param('companyName')) {
			req.flash('error', [ 'Please enter a name!' ]);
		}

		var companyName = req.param('companyName');
		var companyId = companyName.substring(0,4);

		while (fs.existsSync(__dirname + '/../res/' + companyId + '.json')) {
			companyId += companyId[3];
		}

		companyId = companyId.toUpperCase();

		mongoose.model('User').findById(req.session.passport.user, function(error, user) {
			if (error) {
				req.flash('error', [ 'Error with database stuff :(' ]);
				return;
			}

			mongoose.model('Game').create({ "companyName": companyName, "companyId": companyId }, function(error, game) {
				if (error) {
					req.flash('error', [ 'Error with database stuff :(' ]);
					return;
				}

				game.save(function(error) {
					if (error) {
						req.flash('error', [ 'Error with database stuff :(' ]);
						return;
					}

					user.games.push(game._id);
					user.save(function(error) {
						res.redirect('/');
					});
				});
			});
		})
	} else {
		res.redirect('/');
	}
}
