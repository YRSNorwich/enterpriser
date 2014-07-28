
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var connectFlash = require('connect-flash');
var methodOverride = require('method-override');
var expressSession = require('express-session');

var indexRoutes = require('./routes/index');
var authRoutes = require('./routes/auth');

var app = module.exports = express();

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressSession({ secret: 'nope' }));
app.use(bodyParser());
app.use(methodOverride());
app.use(connectFlash());
app.use(express.static(__dirname + '/public'));

// Routes

app.get('/', indexRoutes.index);
app.post('/login', authRoutes.login);

app.listen(3000);7
