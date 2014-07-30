//Propterty Card object
function companyCard(name, id) {
  this.name = name;
  this.id = id;
  this.stockPrice = null;
  this.stockAvailable = null;
  this.view = null;
  this.companyCard = {};
}
//Gets the card and bind data from the api
companyCard.prototype.getData = function(callback) {
  if( this.view ) {
    this.view.unbind();
    console.log(this.view);
    jQuery.getJSON(("http://127.0.0.1:3000/ajax/stock/"+this.id+"/ehwkw000"), function(data){
      callback(data);
    }.bind(this))
  } else {
    jQuery.getJSON(("http://127.0.0.1:3000/ajax/stock/"+this.id+"/ehwkw000"), function(data){
      callback(data);
    }.bind(this))
  }

};
//Binds the card's data to a specified rivets template element ej $("#info")
companyCard.prototype.bindView = function(element, bindObj, callback) {
  this.companyCard = bindObj;
  this.view = rivets.bind(element, { companyCard: this.companyCard });
  callback(!this.view);
};
//Sets the bind data to the card's value
companyCard.prototype.setData = function(data, callback) {
  //this.calcAvailable(window.userGame); When it's ready like
  this.stockPrice = data;
  if( typeof this.stockPrice === "object" ) this.stockPrice = "Stock Not available";
  var cardObject = { name: this.name["label"], code: this.id, available: !this.stockAvailable, stockprice: "Stock Price: " + this.stockPrice, stockavailable: this.stockAvailable };
  callback(cardObject);
};

//Calculates the stock available of the company (ie user has already bought some)
companyCard.prototype.calculateStock = function() {

};
//Places an order for stock: sends a POST request to the api to set the user's owned stock in this company to x amount.
companyCard.prototype.placeOrder = function() {

};
