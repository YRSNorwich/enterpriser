/* Dependancies */
var Parser = require('babyparse');
var fs = require('fs');
var http = require("http");


var key = '&oauth=6e874e71d6bf3b10888b7d20615a9f3e95dce5ab';
var yahoo = "http://ichart.finance.yahoo.com/table.csv?";
var debug = false;


function Yahoo(config) {
	this.config = config;
	this.parser = new Parser( this.config );
}


Yahoo.prototype.buildQuery = function(stock, to, from) {
	var query = new Query(stock, to);
	console.log(query.build());
	if(debug) console.log(query) {
		return query;
	}
}

//Executes a query towards Yahoo! The amazing api that is the only one availiable :(})
Yahoo.prototype.executeQuery = function(query, callback) {
	query.request(function(data){
		callback.bind(this)(data);
	}.bind(this));
}

// Convert CSV to JSON
Yahoo.prototype.csv2json = function(data, strip) {
	if( strip ) {
		var parsed = this.parser.parse(data).results;
		for(i in parsed.fields) {
			for(var p = 0; p < strip.length; p++) {
				if (parsed.fields[i] == strip[p]) {
					delete parsed.fields.splice(i,1);
				}
			}
		}
		for(row in parsed["rows"]) {
			for(var i = 0; i < strip.length; i++) {
				delete parsed["rows"][row][strip[i]];
			}
		}
		return JSON.stringify(parsed);
	} else {
		var parsed = this.parser.parse(data).results;
		return JSON.stringify(parsed);
	}
}


Yahoo.prototype.writeOut = function(options, callback) {
	if( options.name ) {
		fs.writeFile(options.name, options.result, function(err) {
			callback((err) ? console.log( err ) : console.log("Success!"));
		});
	} else {
		fs.writeFile(options.query.stock.substr(3), options.result, function(err) {
			callback((err) ? console.log( err ) : console.log("Success!"));
		});
	}
}


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


module.exports = Yahoo;
