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
    },

    start: function () {
    },

    update: function (dt) {
    },

    loadGame: function () {
        cc.director.loadScene("Game", function () {
            //callback
        })
    },
});
