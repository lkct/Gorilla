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
        this.node.parent.getChildByName("lbl-borderUp")
            .getComponent(cc.Animation).play().repeatCount = Infinity;
        this.node.parent.getChildByName("lbl-borderDown")
            .getComponent(cc.Animation).play().repeatCount = Infinity;
        this.node.parent.getChildByName("lbl-borderLeft")
            .getComponent(cc.Animation).play().repeatCount = Infinity;
        this.node.parent.getChildByName("lbl-borderRight")
            .getComponent(cc.Animation).play().repeatCount = Infinity;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);

        this.playerL = "Player 1";
        this.playerR = "Player 2";
        this.scoreL = 0;
        this.scoreR = 0;
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
    },

    start: function () {
        var spaces = "            ";
        var nameL = spaces.slice(this.playerL.length) + this.playerL;
        var nameR = this.playerR + spaces.slice(this.playerR.length);
        cc.find("Canvas/lbl-names")
            .getComponent(cc.Label).string = nameL + " vs " + nameR;

        var scoreL = this.scoreL.toString();
        scoreL = ((scoreL < 10) ? "0" : "") + scoreL;
        var scoreR = this.scoreR.toString();
        scoreR = ((scoreR < 10) ? "0" : "") + scoreR;
        cc.find("Canvas/lbl-scores")
            .getComponent(cc.Label).string = scoreL + " : " + scoreR;
    },

    update: function (dt) {
    },

    onKeyDown: function (event) {
        if (event.keyCode == cc.macro.KEY.r) {
            cc.find("main").getComponent("main").loadSetting();
        }
        else if (event.keyCode == cc.macro.KEY.q) {
            cc.game.end();
        }
    },
});
