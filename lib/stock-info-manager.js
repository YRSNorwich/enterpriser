var companiesCsv = require('../companies.json');

// convert companiesCsv to be Stock ID -> Data based (more like JSON)
var companies = {};
for (var rowIndex in companiesCsv.rows)
{
    var row = companiesCsv.rows[rowIndex];
    companies[row.Symbol] = { name: row.Name, industry: row.Industry };
    //companies[row.Symbol] = row.Name;
}

// no me gusta el leakos de memoria
companiesCsv = undefined;

var twokfour = new Date('29/12/2003'); // 2004

/**
 * Get the companies stock value at a specified date.
 *
 * @param {String} companyId - the 4 letters long reference for the company on the stock market
 * @param {Date} date - when the data should be relevant
 */
exports.getStockPrice = function (companyId, date)
{
    try
    {
        var stockData = require('../res/' + companyId);
    }
    catch (error)
    {
        throw new Error('Company does not exist!');
    }

    var rowResult = null;
    while (rowResult === null)
    {
        var dateString = date.toISOString().substring(0, 10); // YY-MM-DD
        for (var rowIndex in stockData.rows)
        {
            var row = stockData.rows[rowIndex];
            if (row.Date === dateString)
            {
                rowResult = row;
            }
        }
        date.setDate(date.getDate() - 1);

        if (date.getTime() < twokfour.getTime())
        {
            break;
        }
    }

    if (rowResult === null)
    {
        throw new Error('Company is yet to form!');
    }

    return rowResult.Close;
}

/**
 * Gets a list of all companies, with the key as Stock ID and value as more
 * detail, including full name and industry.
 */
exports.getCompanyList = function ()
{
    return companies;
}
