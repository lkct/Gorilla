// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
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
        cc.find("main").getComponent("main").loadGame();
    },
});
