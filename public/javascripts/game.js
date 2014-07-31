var IDEAL_TPS = 60;
var IDEAL_TICK_DURATION = 1000 / IDEAL_TPS;

function Game() {
    this.time = "3/1/2004";
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

    if (this.secondsActive % 10 === 0) {
        if (!this.doneThisSecond) {
            // occurs once every ten seconds - will be used for chatting to server/advancing date, etc
            this.doneThisSecond = true;
        }
    } else {
        this.doneThisSecond = false;
    }

    requestAnimationFrame(this.tick.bind(this));
}

Game.prototype.initPlayer = function() {

}
