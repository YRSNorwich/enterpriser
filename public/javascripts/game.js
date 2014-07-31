
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
    date: this.dateTo36(this.time)
  }

  this.view = null;

}

Game.prototype.dateTo36 = function(str) {
    return new Date(str).getTime().toString(36);
}
//ID = NON LITERAL EG: 1!!!!
Game.prototype.init = function(id) {




  this.getData(id, function(data) {
      console.log(data, this.gameData);
      this.setGameData(data);
      this.setBind(this.gameData, jQuery(".yourCard"), function(res) {
        this.setPortfolio([this.gameData, data], jQuery(".portfolio"), function(e) {
          view = rivets.bind(jQuery(".portfolio"), {companies: e });
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

    var companies =  [
      {name: "poo"},
      {name: "1"},
      {name: 10}
    ]



  callback(companies);
/*
  var total = [];
    for(var i in data.bought) {
      var buildEntry = {id: i, stockAvailable: data.bought[i]}
      var databought = data.bought[i];
      this.getDataForCompany(i, function(data) {
        buildEntry.worth = data*databought;
        total.push(buildEntry);
        callback(total);

      }.bind(this));
      //worth *= data.bought[i];


    }*/


}

Game.prototype.getDataForCompany = function(id, callback) {
  jQuery.getJSON(("/ajax/stock/"+id+"/"+this.dateTo36(this.gameData.date)), function(data){
    callback(data);
  }.bind(this))

}


Game.prototype.getData = function(id, callback) {

  jQuery.getJSON((this.ajaxReq+"/"+id), function(data){
    jQuery.getJSON(("/ajax/list/"), function(data1){
      callback(data);
      this.rawData = data1;
    }.bind(this))
  }.bind(this));

};

Game.prototype.setGameData = function(data) {
    this.gameData.companyName = data["companyName"];
    this.gameData.companyId = data["companyId"];
    this.gameData.balance = data["balance"];
    this.gameData.shares = data["shares"];
    this.gameData.sharePrice = (this.gameData.balance/this.gameData.shares);
    (data["bought"]) ? this.gameData.bought = data["bought"] : false;
    this.gameData.date = data["day"].substring(0,10);
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

        console.log('FPS:', this.fps);
    }

    window.renderTowers();

    if (this.secondsActive % 10 === 0) {
        if (!this.doneThisSecond) {
            // occurs once every ten seconds - will be used for chatting to server/advancing date, etc

            var currentDate = new Date(this.gameData.date);
            var currentDay = currentDate.getDay();
            console.log(currentDate.getDay());
            this.doneThisSecond = true;
        }
    } else {
        this.doneThisSecond = false;
    }

    requestAnimationFrame(this.tick.bind(this));
}

Game.prototype.initPlayer = function() {

}
