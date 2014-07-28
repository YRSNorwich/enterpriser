
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var routes = require('./routes'),
    yahoo = require('./yahoo.js');
  
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

//App Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', routes.index);


//Testing Yahoo Module
test();

function test() {
  
  var Yahoo = new yahoo(babyParseConfig);
  var googleQuery = Yahoo.buildQuery("GOOGL", "2013");
  Yahoo.executeQuery(googleQuery, function(data, that) {
    var json = that.csv2json(data, ["Open", "High", "Low", "Adj Close"]);
    var doptions = { name: "GOOGL", query: googleQuery, result: json }
    //Doptions: Data and options! Combined!!
    Yahoo.writeOut(doptions, function(status) {

    });
  });


}

app.listen(3000);
