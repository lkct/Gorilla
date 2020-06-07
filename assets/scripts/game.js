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
        dpm: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.is_hand_up = false;
        this.time_stopped = 0.0;
    },

    start: function () {
    },

    update: function (dt) {
        this.time_stopped += dt;
        if (this.time_stopped > 1) {
            this.node.getChildByName("banana").getComponent("banana").move(this.time_stopped, 9.8);
            this.time_stopped = 0.0;
        }
    },
});
