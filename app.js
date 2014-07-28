
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var routes = require('./routes'),
    yahoo = require('./yahoo.js'),
    Parser = require('babyparse'),
    fs = require('fs');

var app = module.exports = express();

//Babyparse Config
var config = {
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
  newline: "\r\n",
}


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
  
  var Yahoo = new yahoo();
  var googleQuery = Yahoo.buildQuery("GOOGL", "10/04/2014");
  var parser = new Parser( config );

  googleQuery.request(function(data) {
  
  // Convert CSV to JSON
  var results = JSON.stringify(parser.parse(data).results);

  console.log( typeof parser.parse(data).results );

 /* fs.writeFile(googleQuery.stock.substr(3), results, function(err) {
    console.log( err );
  });*/

});


}




app.listen(3000);
