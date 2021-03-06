'use strict';

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

var ajaxRoutes = require('./routes/ajax');
var authRoutes = require('./routes/auth');
var gameRoutes = require('./routes/game');
var indexRoutes = require('./routes/index');

var routes = require('./routes');
var yahoo = require('./lib/yahoo.js');
var csvGrabber = require('./lib/csvgrabr.js');

var debug = true;

var babyParseConfig = {
    delimiter: "",
    header: true,
    dynamicTyping: false,
    preview: 0,
    step: undefined,
    encoding: "",
    worker: false,
    comments: false,
    complete: undefined,
    download: false,
    keepEmptyRows: false,
    chunk: undefined,
};

var app = module.exports = express();
mongoose.connect('mongodb://localhost/enterpriser');

//App Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressSession({ secret: 'nope' }));
app.use(bodyParser());
app.use(methodOverride());
app.use(connectFlash());
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
	   done(err, user);
    });
});

// Routes

app.get('/', indexRoutes.index);
app.get('/ajax/list', ajaxRoutes.companyList);
app.get('/ajax/stock/:id/:date', ajaxRoutes.companyStockPrice);

app.post('/login', authRoutes.login);
app.post('/register', authRoutes.register);
app.get('/logout', authRoutes.logout);

app.get('/ajax/game/:id', gameRoutes.giveJson);
app.post('/ajax/game/:id', gameRoutes.receiveJson);
app.post('/game/new', gameRoutes.newGame);


//Testing Yahoo Module
//test();
//csvGrabberTest("../data/companies.csv");
//Got up to entry 136
function csvGrabberTest(string) {


  var grabber = new csvGrabber();
  var file;
  grabber.loadFile(string, babyParseConfig, ["LastSale", "MarketCap", "ADR TSO", "IPOyear", "Sector", "Summary Quote", "Volume"], function(jsonFile) {
    for(var i in jsonFile.jsonObject["rows"]) {
        (function(i) {
          setTimeout(function() {
              var Yahoo = new yahoo(babyParseConfig);
              var company = jsonFile.jsonObject["rows"][i]["Symbol"];
              var newQuery = Yahoo.buildQuery(company, "2000");
              Yahoo.executeQuery(newQuery, function(data) {
                var json = this.csv2json(data, ["Open", "High", "Low", "Adj Close"]);
                  var doptions = { name: "./res/" + company + ".json", query: newQuery, result: json };
                  //Doptions: Data and options! Combined!!
                  Yahoo.writeOut(doptions, function(status) {
                    console.log(status);
                  });
              });
              console.log(i);

          }, 5000 * i);
        })(i);

    }

  });


}
//test();
function test() {
var Yahoo = new yahoo(babyParseConfig);
var googleQuery = Yahoo.buildQuery("GOOGL", "2000");
Yahoo.executeQuery(googleQuery, function(data) {
var json = this.csv2json(data, ["Open", "High", "Low", "Adj Close"]);
var doptions = { name: "GOOGL.json", query: googleQuery, result: json };
//Doptions: Data and options! Combined!!
Yahoo.writeOut(doptions, function(status) {
console.log(status);
});
});
}
/*Reference Function



}*/

app.listen(3000);
