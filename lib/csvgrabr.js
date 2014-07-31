//Imports
var Parser = require('babyparse');
var fs = require('fs');
var http = require("http");
//--

function csvGrabber(config) {
	this.config = config;
	this.parser = new Parser( this.config );
}

csvGrabber.prototype.loadFile = function(fileName, config, strip, callback) {
	var content = new jsonFile(config);
	fs.readFile(fileName, "utf-8", function(err, data) {
		if( err ) {
			throw err;
		}
		content.setData(data, strip);
		callback(content);
	});
};

csvGrabber.prototype.writeFile = function(options, callback) {
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

function jsonFile(config) {
	this.data = ""; //Raw csv data
	this.json = null; //Raw json data
	this.jsonObject = null; //Json stored as object
	this.config = config;
	this.parser = new Parser( this.config );
}

jsonFile.prototype.setData = function(json, strip) {

	if( strip ) {
		var parsed = this.parser.parse(json).results;

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
		var jsonParsed = JSON.stringify(parsed);
	} else {
		var parsed = this.parser.parse(json).results;
		var jsonParsed = JSON.stringify(parsed);
	}

	this.data = json;
	this.json = jsonParsed;
	this.jsonObject = JSON.parse(jsonParsed);

}

jsonFile.prototype.deleteCol = function(index) {
	// TODO
}

jsonFile.prototype.deleteRow = function(index) {
	// TODO
}


module.exports = csvGrabber
