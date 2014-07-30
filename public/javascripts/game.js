function Game() {
  this.time = "1/1/2004";
  this.sessionId;
  this.ajaxReq = "http://127.0.0.1:3000/ajax/game"
  this.currentCompanyCard;
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

      this.setGameData(data)
      this.setBind(this.gameData, jQuery(".yourCard"), function(res) {

      });


  }.bind(this));
}

Game.prototype.setBind = function(data, element, callback) {
  this.view = rivets.bind(element, { yourCard: this.gameData });
}


Game.prototype.getData = function(id, callback) {
  jQuery.getJSON((this.ajaxReq+"/"+id), function(data){
    callback(data);
  }.bind(this));
};



Game.prototype.setGameData = function(data) {
  this.gameData.companyName = data["companyName"];
  this.gameData.companyId = data["companyId"];
  this.gameData.balance = data["balance"];
  this.gameData.shares = data["shares"];
  this.gameData.sharePrice = (this.gameData.balance/this.gameData.shares);
  (data["bought"]) ? this.gameData.bought = data["bought"] : false;
  this.gameData.date = data["date"];
}



Game.prototype.tick = function() {


}

Game.prototype.initPlayer = function() {

}
