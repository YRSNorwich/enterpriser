var fs = require('fs');

var stockInfoManager = require('../lib/stock-info-manager');

function getStockJsonSafeData(companyId, epochMilliseconds) {
	try {
		return stockInfoManager.getStockPrice(companyId, new Date(epochMilliseconds));
	} catch (error) {
		return { "error": error.message };
	}
}

exports.companyStockPrice = function(req, res) {
	if (!req.param("date")) {
		res.json({ "error": "No date specified!" });
		return;
	}

	var date = parseInt(req.param("date"), 36);

	if (date === NaN) {
		res.json({ "error": "Date should be in the form of a base 36 number! (seconds since Unix epoch) Hint: number.toString(36)" });
		return;
	}

	if (!req.param("id")) {
		res.json({ "error": "Please provide IDs in the form of Stock market IDs, seperated by the delimeter '+'" });
		return;
	}

	var ids = req.param("id").split('+');

	if (ids.length === 1) {
		res.json(getStockJsonSafeData(ids[0], date));
	} else {
		var results = {};
		for (var idIndex in ids) {
			var id = ids[idIndex];
			results[id] = getStockJsonSafeData(id, date);
		}
		res.json(results);
	}
}

exports.companyList = function(req, res) {
	var companyList = stockInfoManager.getCompanyList();
	fs.readdir(__dirname + '/../res', function(error, files) {
		if (error) {
			res.json({ "error": error.message });
			return;
		}

		var result = {};
		for (var fileIndex in files) {
			var fileBase = files[fileIndex].split('.')[0]; // e.g. "GOOGL.json" -> "GOOGL"
			result[fileBase] = companyList[fileBase];
		}
		res.json(result);
	})
}
