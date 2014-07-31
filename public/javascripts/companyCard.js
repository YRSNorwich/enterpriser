//Property Card object
function companyCard(name, id) {
  this.name = name;
  this.id = id;
  this.stockPrice = null;
  this.stockAvailable = null;
  this.view = null;
  this.companyCard = {};

  this.rawData = null;

}
//Gets the card and bind data from the api
companyCard.prototype.getData = function(callback) {
    if( this.view ) {
        this.view.unbind();

        jQuery.getJSON(("/ajax/stock/"+this.id+"/"+game.dateTo36(game.gameData.day)), function(data){
            callback(data);
        }.bind(this))
    } else {
        console.log(game.gameData.day, game.dateTo36(game.gameData.day)); //HOLY CRAP I BE STUPID
        jQuery.getJSON(("/ajax/stock/"+this.id+"/"+game.dateTo36(game.gameData.day)), function(data){
            callback(data);
        }.bind(this))
    }

};
//Binds the card's data to a specified rivets template element ej $("#info")
companyCard.prototype.bindView = function(element, bindObj, callback) {
    this.companyCard = bindObj;
    this.companyCard.stockavailable = 1000;
    this.view = rivets.bind(element, { companyCard: this.companyCard });
    this.calculateStock();
    callback(!this.view);
};
//Sets the bind data to the card's value
companyCard.prototype.setData = function(data, callback) {
    //this.calcAvailable(window.userGame); When it's ready like
    this.stockPrice = data;
    if( typeof this.stockPrice === "object" ) this.stockPrice = "Stock Not available";
        var cardObject = { name: this.name["label"], code: this.id, available: !this.stockAvailable, stockprice: "Stock Price: " + this.stockPrice, stockavailable: this.stockAvailable };
        this.companyCard = cardObject;
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
        console.log(this.companyCard.stockavailable);
        var orderPrice = (amount*price);
        if(game.gameData.balance >= orderPrice && (this.companyCard.stockavailable-amount) > 0) {
            game.gameData.bought[stockId] = ~~game.gameData.bought[stockId] + amount; //AMAZING
            this.calculateStock(); //Calculates new stock price
            game.gameData.balance -= orderPrice;//Minus from da balance
            console.log(" User: "+ game.sessionId + " Bought stock in: " + stockId + " Amount: " + amount); //Validate order
            jQuery.post("/ajax/game/"+game.sessionId, game.gameData, function(data, err){
                console.log(data);
                console.log(err);
            }); //Push da order to da server;

        } else {
            alert("You don't have enough money at this time to buy this much stock in this company! Try selling some / making more money and trying again.");
        }
    };
