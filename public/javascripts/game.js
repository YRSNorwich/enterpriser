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
        this.setPortfolio();
      });


  }.bind(this));

}

Game.prototype.setBind = function(data, element, callback) {
  this.view = rivets.bind(element, { yourCard: this.gameData });
  callback();
}

Game.prototype.setPortfolio = function(callback) {
  var data = this.rawData;

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


    }


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



Game.prototype.tick = function() {


}

Game.prototype.initPlayer = function() {

}
