// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.game.addPersistRootNode(this.node);

        this.playerL = "Player 1";
        this.playerR = "Player 2";
        this.ngames = 3;
        this.gravity = 9.8;
    },

    start: function () {
    },

    update: function (dt) {
    },

    loadSetting: function () {
        cc.director.loadScene("Setting", function () { });
    },

    loadGame: function (playerL, playerR, ngames, gravity) {
        this.playerL = playerL;
        this.playerR = playerR;
        this.ngames = ngames;
        this.gravity = gravity;

        var self = this;
        cc.director.loadScene("Game", function () {
            var game = cc.find("Canvas/game").getComponent("game");
            game.playerL = self.playerL;
            game.playerR = self.playerR;
            game.gravity = self.gravity;
        });
    },

    loadNext: function (scoreL, scoreR) {
        this.ngames--;
        if (this.ngames == 0) {
            this.loadEnd(scoreL, scoreR);
            return;
        }

        var self = this;
        cc.director.loadScene("Game", function () {
            var game = cc.find("Canvas/game").getComponent("game");
            game.playerL = self.playerL;
            game.playerR = self.playerR;
            game.gravity = self.gravity;
            game.scoreL = scoreL;
            game.scoreR = scoreR;
        });
    },

    loadEnd: function (scoreL, scoreR) {
        var self = this;
        cc.director.loadScene("End", function () {
            var end = cc.find("Canvas/end").getComponent("end");
            end.playerL = self.playerL;
            end.playerR = self.playerR;
            end.scoreL = scoreL;
            end.scoreR = scoreR;
        });
    },
});
