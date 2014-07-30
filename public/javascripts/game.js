function Game() {
  this.time = "1/1/2004";
  this.sessionId;
  this.ajaxReq = "http://127.0.0.1:3000/ajax/game"
  this.gameData = {
    companyName: null,
    companyId: null,
    balance: 100000,
    shares: 1000,
    bought: {},
    date: this.dateTo36(this.time)
  }
}

Game.prototype.dateTo36 = function(str) {
  return new Date(str).getTime().toString(36);
}
//ID = NON LITERAL EG: 1!!!!
Game.prototype.init = function(id) {
  this.getData(id, function(data) {
    console.log("POO");
    this.setGameData(data, function() {
      this.setBind(this.gameData, function() {

      });

    });
  });
}

Game.prototype.setBind = function(data, callback) {

}

Game.prototype.getData = function(id, callback) {
  jQuery.getJSON((this.ajaxReq+"/"+id), function(data){
    callback(data);
  }.bind(this));
};



Game.prototype.setGameData = function(data, callback) {
  this.gameData.companyName = data["name"];
  this.gameData.companyId = data["id"];
  this.gameData.balance = data["balance"];
  this.gameData.shares = data["shares"];
  this.gameData.bought = data["bought"];
  this.gameData.date = data["date"];
  callback();
}



Game.prototype.tick = function() {


}

Game.prototype.initPlayer = function() {

}
