
var IDEAL_TPS = 60;
var IDEAL_TICK_DURATION = 1000 / IDEAL_TPS;

function Game(id) {


  this.time = "3/1/2004";
  this.sessionId = id;
  this.ajaxReq = "/ajax/game"
  this.currentCompanyCard;
  this.companyData;
  this.valuation;
  this.companies = [];
  this.gameData = {
    companyName: null,
    companyId: null,
    balance: 100000,
    shares: 1000,
    sharePrice: (this.balance / this.shares),
    bought: {},
    day: this.dateTo36(this.time)
  }

  this.portCard = {
    name: null,
    id: null,
    shares: null,
    price: null
  }

  this.view = null;

}

Game.prototype.dateTo36 = function(str) {
    return new Date(str).getTime().toString(36);
}
//ID = NON LITERAL EG: 1!!!!
Game.prototype.init = function(id) {

  this.getData(id, function(data) {

      pushGraphValue(game.gameData.balance);
      this.setGameData(data);
       this.getDataForCompany(this.companyCard.companyCard.code, function(data) {
           this.companyCard.stockPrice = data;
           this.companyCard.companyCard.stockprice = "Stock Price: " + data;
           jQuery("#sellSlider").slider( { max: this.portCard.shares } );
         }.bind(this));
      this.rawData = data;
      
      this.setPortData(game.gameData, "GOOGL");
      
      this.setBind(this.gameData, jQuery(".yourCard"), function(res) {
        
        this.setPortfolio([data], jQuery("#portfolio"), function(e) {
          
          game.tick();
        
        });
      
      }.bind(this));

  }.bind(this));

}

Game.prototype.setBind = function(data, element, callback) {
  this.view = rivets.bind(element, { yourCard: this.gameData });
  
  this.portView = rivets.bind(jQuery(".portfolio"), { portdata : this.portCard });
  
  callback();
}

Game.prototype.setPortfolio = function(data, element, callback) {
  var bought = data[0]["bought"];
  for(var i in bought) {
    if( bought.length ) {
        element.append(jQuery("<li>No stocks owned yet!</li>"));
    } else {
      var buildItem = jQuery("<li><a class='portfolioSelect' href='"+i+"'>  Company: " + i + " " + "Stock Owned: " + bought[i] + "</a></li>");
      jQuery('#portlist').append(buildItem);
    }
  }
  callback();
}

Game.prototype.updatePortfolio = function(callback) {
  var element = jQuery("#portfolio");
  this.getData(this.sessionId, function(data1){
      var data = [data1];

      var bought = data[0]["bought"];
        jQuery("#portlist").empty(); //FUCKING LOVE JQUERY :D:D:DD:D::D:D:::D:
        for(var i in bought) {
          var buildItem = jQuery("<li><a class='portfolioSelect' href='"+i+"'>  Company: " + i + " " + "Stock Owned: " + bought[i] + "</a></li>");
          jQuery('#portlist').append(buildItem);
        }
        callback();
  })
}

jQuery("body").on("click", ".portfolioSelect", function(e){
  var id = jQuery(this).attr("href");
  e.preventDefault();
  game.setPortData(game.gameData, id);
});

Game.prototype.setPortData = function(data1, i) {
    this.getDataForCompany(i, function(data, id) {
      var compId = id;
      var compName = this.rawData[id]["name"];
      var dataPrice = data;
      var amount = data1["bought"][id]
      this.portCard.name = compName;
      this.portCard.id = compId;
      this.portCard.shares = amount;
      this.portCard.price = dataPrice;
      this.portCard.balVal = (amount*dataPrice);
      jQuery("#sellSlider").slider( { max: this.portCard.shares } );
    }.bind(this))
}

Game.prototype.setGameData = function(data) {
    this.gameData.companyName = data["companyName"];
    this.gameData.companyId = data["companyId"];
    this.gameData.balance = data["balance"];
    this.gameData.shares = data["shares"];
    this.gameData.sharePrice = (this.gameData.balance/this.gameData.shares);
    (data["bought"]) ? this.gameData.bought = data["bought"] : false;
    this.gameData.day = data["day"].substring(0,10);
    console.log("Data Set");
}

Game.prototype.getDataForCompany = function(id, callback) {
  jQuery.getJSON(("/ajax/stock/"+id+"/"+this.dateTo36(this.gameData.day)), function(data){
    callback(data,id);
  }.bind(this))

}



Game.prototype.getData = function(id, callback) {
  jQuery.getJSON((this.ajaxReq+"/"+id), function(data){
    delete data.bought["anything"];
    this.setGameData(data);

    jQuery.getJSON(("/ajax/list/"), function(data1){
      callback(data, data1);
      this.rawData = data1;
    }.bind(this));
  }.bind(this));
};



jQuery("body").on("click", "#sellButton", function(e) {
  console.log(game.companyCard.stockPrice);
  if(game.companyCard.stockPrice !== "Stock Not available") {
    console.log("User inited sell for: " + game.portCard.id + " " + game.sellSliderValue )
    game.placeSell(game.portCard.id, game.sellSliderValue, game.portCard.price);
  } else {
    alert("Cannot place order for stocks because at this time there is no stock data available for this company/it does not exist :D");
 }

});

Game.prototype.placeSell = function(id, amount, price) {
  var sellValue = (amount * price);
  if( amount <= this.portCard.shares) { //IF LESS OR EQUAL TO
    if(!(amount === this.gameData.bought[id])) { //IF NOT SELLING ALL
       this.gameData.bought[id] = ~~this.gameData.bought[id] - amount; //EDIT STORED VALUE
       this.companyCard.calculateStock();
       console.log("Sold for: " + sellValue);
       this.gameData.balance += sellValue;
       jQuery.post("/ajax/game/"+this.sessionId, this.gameData, function(data, err){
                console.log(data);
                console.log(err);
                this.updatePortfolio(function() {
                    this.setPortData(game.gameData, this.portCard.id);
        }.bind(this));
        }.bind(this)); //Push da order to da server;
    } else { //IS SELLING ALL
       console.log("soldALL");
       this.gameData.bought[id] = ~~this.gameData.bought[id] - amount; //EDIT STORED VALUE
       this.companyCard.calculateStock();
       console.log("Sold for: " + sellValue);
       this.gameData.balance += sellValue;
       console.log(this.gameData.bought[id], id);
       var whop = "anything";
       this.gameData.bought[whop] = "Go fuck yourself jQuery.";
       
       delete this.gameData.bought[id];

      /*) if(this.gameData.bought === undefined) {
        console.log("POPOD");
        this.gameData.bought = {};
       }*/
       //console.log(this.gameData.bought, "POO");
       jQuery.post("/ajax/game/"+this.sessionId, this.gameData, function(data, err){
                console.log(data);
                console.log(err);
                console.log(this.gameData.bought);
                console.log(data.bought);
                this.updatePortfolio(function() {
                  console.log(this.gameData.bought);
                    this.setPortData(game.gameData, this.portCard.id);
                }.bind(this));
        }.bind(this), "json"); //Push da order to da server;

    }
   

  }

}



Game.prototype.tick = function () {
    var now = new Date().getTime();
    var duration = now - (this.lastTime || now);
    this.lastTime = now;
    var delta = duration / IDEAL_TICK_DURATION;

    this.framesThisSecond = ~~this.framesThisSecond + 1;
    this.progressThisSecond = (this.progressThisSecond || 0) + delta;

    if (this.progressThisSecond > IDEAL_TPS) {
        this.fps = this.framesThisSecond;
        this.framesThisSecond = 0;
        this.progressThisSecond = 0;
        this.secondsActive = (this.secondsActive || 0) + 1;

        //console.log('FPS:', this.fps);
    }

    // if ready to render
    // TODO fix change in order glitch
    if (this.gameData.companyId !== null)
    {
        var stockNames = Object.keys(this.gameData.bought);
        var highestStockNames = [];

        // only keep 4 most owned
        for (var i = 0; i < 4; i++)
        {
            var highestStockIndex = null;
            var highestStockAmount = -Infinity;

            for (var stockNameIndex in stockNames)
            {
                var stockName = stockNames[stockNameIndex];

                if (stockName === this.gameData.companyId)
                {
                    continue;
                }

                if (this.gameData.bought[stockName] > highestStockAmount)
                {
                    highestStockIndex = stockNameIndex;
                    highestStockAmount = this.gameData.bought[stockName];
                }
            }

            if (highestStockIndex !== null)
            {
                highestStockNames.push(stockNames[highestStockIndex]);
                stockNames.splice(highestStockIndex, 1);
            }
        }

        var toRender = {};
        toRender[this.gameData.companyId] = this.gameData.shares;

        for (var stockNameIndex in highestStockNames)
        {
            var stockName = highestStockNames[stockNameIndex];
            toRender[stockName] = this.gameData.bought[stockName];
        }

        window.renderTowers(toRender);
    }
    else
    {
        // play safe
        window.renderTowers({});
    }

    // test line window.renderTowers({'FRAN': 4, 'GOOG': 2, 'AAPL': 3, 'MICR': 3.25, 'SANF': 3.1111, 'EEJ': 2, 'MJIC': 1.2});

    if (this.secondsActive % 10 === 0) {
        if (!this.doneThisSecond) {
          var tempDate = new Date(this.gameData.day);
          tempDate.setUTCDate(tempDate.getUTCDate() + 1);
          this.gameData.day = new Date(tempDate.toISOString());

          jQuery("#sellSlider").slider( { max: this.portCard.shares } );
          
          jQuery.post("/ajax/game/"+this.sessionId, this.gameData, function(data, err){

            this.getData(this.sessionId, function(data) {
              this.setGameData(data);
              console.log(game.gameData.bought.length);
              if(game.gameData.bought) {
                this.setPortData(game.gameData, this.portCard.id);
              }
                

                pushGraphValue(game.gameData.balance);

            }.bind(this));

          }.bind(this)); //Push da order to da server;

         this.getDataForCompany(this.companyCard.companyCard.code, function(data) {
           this.companyCard.stockPrice = data;
           this.companyCard.companyCard.stockprice = "Stock Price: " + data;
           jQuery("#sellSlider").slider( { max: this.portCard.shares } );
         }.bind(this));

            this.doneThisSecond = true;
        }
    } else {
        this.doneThisSecond = false;
    }

    requestAnimationFrame(this.tick.bind(this));
}
