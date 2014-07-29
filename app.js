
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var connectFlash = require('connect-flash');
var expressSession = require('express-session');
var methodOverride = require('method-override');

var authRoutes = require('./routes/auth');
var indexRoutes = require('./routes/index');

var app = module.exports = express();
mongoose.connect('mongodb://localhost/enterpriser');

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressSession({ secret: 'nope' }));
app.use(bodyParser());
app.use(methodOverride());
app.use(connectFlash());
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Routes

app.get('/', indexRoutes.index);
app.get('/login', authRoutes.loginForm);
app.get('/register', authRoutes.registrationForm);

app.post('/login', authRoutes.login);
app.post('/register', authRoutes.register);

app.listen(3000);
