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
        if (!this.isL) {
            this.node.scaleX = -1;
        }
        this.speedX = -50;
        this.speedY = 50;
        this.gamenode = cc.find("Canvas")
        this.dpm = this.gamenode.getComponent("game").dpm;
    },

    start: function () {
    },

    update: function (dt) {
    },

    move: function (dt, accel) {
        this.speedY -= dt * accel / 2;
        this.node.x += this.speedX * dt * (this.isL ? 1 : -1) * this.dpm;
        this.node.y += this.speedY * dt * this.dpm;
        this.speedY -= dt * accel / 2;
        this.node.rotation += 90 * (this.isL ? 1 : -1);
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        else if (this.rotation < 0) {
            this.rotation += 360;
        }

        if (this.isL && (this.node.x < -this.gamenode.width / 2)) {
            this.node.x += this.gamenode.width;
        }
        if (!this.isL && (this.node.x > this.gamenode.width / 2)) {
            this.node.x -= this.gamenode.width;
        }

        if ((this.node.x < -this.gamenode.width / 2) ||
            (this.node.x > this.gamenode.width / 2)) {
            return -1;
        }
        return 0;
    }
});
