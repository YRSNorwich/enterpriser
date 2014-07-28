
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    yahoo = require('./yahoo.js'),
    Parser = require('babyparse'),
    fs = require('fs');

var app = module.exports = express.createServer();

var config = {
  delimiter: "",
  header: false,
  dynamicTyping: false,
  preview: 0,
  step: undefined,
  encoding: "",
  worker: false,
  comments: false,
  complete: undefined,
  download: false,
  keepEmptyRows: false,
  chunk: undefined
}

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


test();



function test() {
  
  var Yahoo = new yahoo();
  
  var googleQuery = Yahoo.buildQuery("GOOGL", "10/04/2014");


  var parser = new Parser( config );

  

  googleQuery.request(function(data) {
  
  // Convert CSV to JSON
  var results = JSON.stringify(parser.parse(data).results);

  fs.writeFile(googleQuery.stock.substr(3), results, function(err) {
    console.log("There was AN ERROR!" + err);
  });



});


}





// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
