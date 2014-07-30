//Propterty Card object
function companyCard() {
  this.name = "";
  this.id = "";
  this.stockPrice = null;
  this.stockAvailable = null;

  this.infoData = {};
  this.amountData = {};
}
//Gets the card and bind data from the api
companyCard.prototype.getData = function() {

};
//Binds the card's data to a specified rivets template element ej $("#info")
companyCard.prototype.bind = function(element) {
  rivets.bind(element, {info:this.infoData, amount: this.amountData}
};
//Sets the bind data to the card's value
companyCard.prototype.setData = function() {

};
//Calculates the stock available of the company (ie user has already bought some)
companyCard.prototype.calculateStock = function() {

};
//Places an order for stock: sends a POST request to the api to set the user's owned stock in this company to x amount.
companyCard.prototype.placeOrder = function() {

};
