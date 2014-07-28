(function() {

var key = '&oauth=6e874e71d6bf3b10888b7d20615a9f3e95dce5ab';
var yahoo = "http://ichart.finance.yahoo.com/table.csv";
var debug = true;


/* Contructors */
var Query = function(stock, data) {
	this.url = url;
	this.data = data;
	this.stock = "&s=" + stock;
		this.to = "&c=" + data[0];
		this.from = data[1];
}

Query.prototype.build = function() {
	//Build an api query
	var temp = this.url + this.data + this.to + this.from + key;
	return temp;
}

Query.protoype.request = function() {

}

/* Methods */


function buildQuery(stock, to, from) {
	var query = new Query(yahoo, [to, from]).build();
	if(debug) console.log(query);
	return query;
}




})();