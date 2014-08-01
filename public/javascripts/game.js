
var IDEAL_TPS = 60;
var IDEAL_TICK_DURATION = 1000 / IDEAL_TPS;

function Game(id) {


  this.time = "3/1/2004";
  this.sessionId = id;
  this.ajaxReq = "/ajax/game"
  this.currentCompanyCard;
  this.companyData;
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

      this.setGameData(data);
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
    this.setGameData(data);
    jQuery.getJSON(("/ajax/list/"), function(data1){
      callback(data, data1);
      this.rawData = data1;
    }.bind(this));
  }.bind(this));

};

Game.prototype.placeSell = function(id, amount, price) {
  var sellValue = amount*price;
  if(amount <= this.portCard.shares) {

    this.gameData.bought[id] = ~~this.gameData.bought[id] - amount; //AMAZING
    this.companyCard.calculateStock();
    this.gameData.balance += sellValue;
    if(amount === this.gameData.bought[id]) {
      this.removeCompany(id);
      console.log("TEST");
    }
    jQuery.post("/ajax/game/"+this.sessionId, this.gameData, function(data, err){
      console.log(data);
      console.log(err);
    }); //Push da order to da server;
    console.log(this.gameData.bought[id]);
    this.setPortData(this.gameData, id);
    jQuery("#sellSlider").slider( { max: this.portCard.shares } );
  } else {
    alert("NO SALE");
  }


}

jQuery("body").on("click", "#sellButton", function(e) {
  if(game.companyCard.stockPrice !== "Stock Not available") {
    game.placeSell(game.portCard.id, game.sellSliderValue, game.companyCard.stockPrice);
  } else {
    alert("Cannot place order for stocks because at this time there is no stock data available for this company/it does not exist :D");
  }

});


Game.prototype.removeCompany = function(id) {
  console.log(this.gameData.bought)
  delete this.gameData.bought[id];
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
        var toRender = {};

        // TODO replace with valuation; need to write lib script for this
        toRender[this.gameData.companyId] = this.gameData.shares;

        // TODO maybe we should render stock prices instead? Although this will be graphed...
        for (var investedStockName in this.gameData.bought)
        {
            toRender[investedStockName] = this.gameData.bought[investedStockName];
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
          tempDate.setDate(tempDate.getDate() + 1);
          this.gameData.day = new Date(tempDate.toUTCString());

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
