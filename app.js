'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var routes = require('./routes'),
    yahoo = require('./yahoo.js'),
    csvGrabber = require('./csvgrabr.js');
  
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
//test();
csvGrabberTest("./companies.csv");
function csvGrabberTest(string) {
  var grabber = new csvGrabber();
  var file;
  grabber.loadFile(string, babyParseConfig, ["LastSale", "MarketCap", "ADR TSO", "IPOyear", "Sector", "Summary Quote"], function(jsonFile) {
    grabber.writeFile({ name: "COMPANIES.txt", result: jsonFile.json }, function(status) {
      console.log(status);
    });
  });

}


function test() {
  
  var Yahoo = new yahoo(babyParseConfig);
  var googleQuery = Yahoo.buildQuery("GOOGL", "2013");
  Yahoo.executeQuery(googleQuery, function(data, that) {
    var json = that.csv2json(data, ["Open", "High", "Low", "Adj Close"]);
    var doptions = { name: "GOOGL", query: googleQuery, result: json };
    //Doptions: Data and options! Combined!!
    Yahoo.writeOut(doptions, function(status) {
      console.log(status);
    });
  });


}

app.listen(3000);
