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
        // this.dance();
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
        this.node.getComponent(cc.Animation).play(this.getHandupAnim(other));
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

    throw: function (angle, speed, bananaPrefab) {
        this.handUp();
        var banana = cc.instantiate(bananaPrefab);
        banana.name = "banana";
        this.node.parent.addChild(banana);
        banana.setPosition(this.node.x - 8 * (this.isL ? 1 : -1),
            this.node.y + 36);
        banana.getComponent("banana").isL = this.isL;
        angle = angle / 180 * Math.PI;
        banana.getComponent("banana").speedX = speed * Math.cos(angle);
        banana.getComponent("banana").speedY = speed * Math.sin(angle);
    }
});
