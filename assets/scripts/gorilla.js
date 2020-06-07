// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        isL: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
    },

    start: function () {
    },

    update: function (dt) {
    },

    getHandupAnim: function (other) {
        var isL = this.isL ^ other;
        postfix = "-r";
        if (isL) {
            postfix = "-l";
        }
        return "handup" + postfix;
    },

    handUp: function (other = false) {
        this.node.getComponent(cc.Animation).play(this.getHandupAnim(other))
    },

    dance: function (repeat = 3) {
        var self = this;
        var anim = this.node.getComponent(cc.Animation);
        for (let i = 0; i < repeat; i++) {
            anim.scheduleOnce(function () {
                this.play(self.getHandupAnim(false));
            }, i);
            anim.scheduleOnce(function () {
                this.play(self.getHandupAnim(true));
            }, i + 0.5);
        }
    },
});
