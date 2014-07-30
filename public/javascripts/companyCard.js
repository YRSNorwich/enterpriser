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
  this.companyCard.stockavailable = 1000;
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
  var boughtData = game.gameData.bought;
  for(var i in boughtData) {
    if(this.id === i) {
      this.companyCard.stockavailable -= boughtData[i];
      jQuery(".slider").max = this.companyCard.stockavailable;
    }
  }
};

jQuery("#placeOrder").on("click", function(e) {
  if(game.companyCard.stockPrice !== "Stock Not available") {
    game.companyCard.placeOrder(game.companyCard.id, game.sliderValue, game.companyCard.stockPrice);
  } else {
    alert("Cannot place order for stocks because at this time there is no stock data available for this company/it does not exist :D");
  }


});

//Places an order for stock: sends a POST request to the api to set the user's owned stock in this company to x amount.
companyCard.prototype.placeOrder = function(stockId, amount, price) {
  
  var orderPrice = (amount*price)
  game.gameData.bought[stockId] = ~~game.gameData.bought[stockId] + amount;
  this.calculateStock();


  game.gameData.balance -= orderPrice;


  console.log(" User: "+ game.sessionId + " Bought stock in: " + stockId + " Amount: " + amount);


  jQuery.post("/ajax/game/"+game.sessionId, game.gameData, function(data, err){
    console.log(data);
    console.log(err);
  })




};
