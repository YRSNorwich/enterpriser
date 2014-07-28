var http = require("http");
var key = '&oauth=6e874e71d6bf3b10888b7d20615a9f3e95dce5ab';
var yahoo = "http://ichart.finance.yahoo.com/table.csv?";
var debug = true;


function Yahoo() { }

/* Contructors */
function Query(stock, to) {

	this.stock = "&s=" + stock;
	this.to = "&c=" + to;

	this.url = "";
	
	this.build = function() {
		//Build an api query
		var temp = yahoo + this.stock + this.to + key;
		this.url = temp;
		return temp;
	};
	
	this.request = function(callback) {
	
	// Utility function that downloads a URL and invokes
	// callback with the data.
	  http.get(this.url, function(res) {
	    var data = "";
	    res.on('data', function (chunk) {
	      data += chunk;
	    });
	    res.on("end", function() {
	      callback(data);
	    });
	  }).on("error", function() {
	    callback(null);
	  });
	}
};


/* Methods */
Yahoo.prototype.buildQuery = function(stock, to, from) {
	var query = new Query(stock, to);
	console.log(query.build());
	if(debug) console.log(query);
	return query;
}

module.exports = Yahoo;
