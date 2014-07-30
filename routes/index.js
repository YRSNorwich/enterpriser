var mongoose = require('mongoose');

/*
 * GET home page.
 */

exports.index = function(req, res){
    if (req.session.passport.user)
    {
        if (req.param('gameId') !== undefined)
        {
            res.render('index', { "req": req, "res": res, "gameId": req.param('gameId') });
            return;
        }

        var User = mongoose.model('User');
        User.findById(req.session.passport.user, function (error, user) {
            if (error)
            {
                res.redirect('/');
                return;
            }

            var Game = mongoose.model('Game');

            Game.find({ _id: { $in: user.games } }, function (error, games) {
                if (error)
                {
                    res.redirect('/');
                    return;
                }

                res.render('index', { "req": req, "res": res, "games": games });
            })
        })
    }
    else
    {
        var loginError = req.flash('error');
        loginError = loginError === undefined ? undefined : loginError[0];
        var registrationError = req.flash('registrationError');
        res.render('index', { "req": req, "res": res, "loginError": loginError, "registrationError": registrationError })
    }
};
