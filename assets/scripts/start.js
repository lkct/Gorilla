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
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
    },

    start: function () {
    },

    update: function (dt) {
    },

    onKeyDown: function (event) {
        cc.find("main").getComponent("main").loadSetting();
    },
});
