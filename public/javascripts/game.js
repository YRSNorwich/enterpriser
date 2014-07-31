
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
      this.setPortData(data, "GOOG");
      this.setBind(this.gameData, jQuery(".yourCard"), function(res) {
        this.setPortfolio([data], jQuery("#portfolio"), function(e) {

          game.tick();
        });
      }.bind(this));


  }.bind(this));

}

Game.prototype.setBind = function(data, element, callback) {
  this.view = rivets.bind(element, { yourCard: this.gameData });
  callback();
}

Game.prototype.setPortfolio = function(data, element, callback) {
  var bought = data[0]["bought"];
  for(var i in bought) {
    var buildItem = jQuery("<li><a class='portfolioSelect' href='"+i+"'>  Company: " + i + " " + "Stock Owned: " + bought[i] + "</a></li>");
    jQuery('#portlist').append(buildItem);
  }
  callback();
}

jQuery("body").on("click", ".portfolioSelect", function(e){



  var id = jQuery(this).attr("href");
  e.preventDefault();
  game.setPortData(game.gameData, id)

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
      rivets.bind(jQuery(".portfolio"), { portdata : this.portCard });
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
    }

Game.prototype.getDataForCompany = function(id, callback) {
  jQuery.getJSON(("/ajax/stock/"+id+"/"+this.dateTo36(this.gameData.day)), function(data){
    callback(data,id);
  }.bind(this))

}



Game.prototype.getData = function(id, callback) {

  jQuery.getJSON((this.ajaxReq+"/"+id), function(data){
    jQuery.getJSON(("/ajax/list/"), function(data1){
      callback(data, data1);
      this.rawData = data1;
    }.bind(this))
  }.bind(this));

};



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

        console.log('FPS:', this.fps);
    }

    window.renderTowers();

    if (this.secondsActive % 10 === 0) {
        if (!this.doneThisSecond) {
          var tempDate = new Date(this.gameData.day);
          tempDate.setDate(tempDate.getDate() + 1);
          this.gameData.day = tempDate.toISOString().substring(0, 10);
          console.log(this.gameData.day);
          jQuery.post("/ajax/game/"+this.sessionId, this.gameData, function(data, err){
              console.log(data);
              console.log(err);
          }); //Push da order to da server;

          this.getData(3, function(data) {
            this.setGameData(data);
          }.bind(this));
            // occurs once every ten seconds - will be used for chatting to server/advancing date, etc
            /*
            var currentDate = new Date(this.gameData.date);
            var currentDay = currentDate.getDay();
            console.log(currentDate.getDay());*/
            this.doneThisSecond = true;

        }
    } else {
        this.doneThisSecond = false;
    }

    requestAnimationFrame(this.tick.bind(this));
}

Game.prototype.initPlayer = function() {

}
