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
        this.dpm = this.node.parent.getComponent("game").dpm;
        this.boardNode = cc.find("Canvas");
        this.collided = false;
        this.isToDestroy = false;
    },

    start: function () {
    },

    update: function (dt) {
        if (this.collided &&
            !this.node.getComponent(cc.Animation)
                .getAnimationState("explosion-banana").isPlaying) {
            this.isToDestroy = true;
        }
    },

    move: function (dt, accel, wind, drag) {
        if (this.collided) {
            return true;
        }

        wind *= (this.isL ? 1 : -1);
        this.speedX -= dt * (this.speedX - wind) * drag / 2;
        this.speedY -= dt * accel / 2;
        this.node.x += this.speedX * dt * (this.isL ? 1 : -1) * this.dpm;
        this.node.y += this.speedY * dt * this.dpm;
        this.speedX -= dt * (this.speedX - wind) * drag / 2;
        this.speedY -= dt * accel / 2;
        this.node.angle -= 90 * (this.isL ? 1 : -1);
        if (this.angle >= 360) {
            this.angle -= 360;
        }
        else if (this.angle < 0) {
            this.angle += 360;
        }

        if (this.isL && (this.node.x < -this.boardNode.width / 2)) {
            this.node.x += this.boardNode.width;
        }
        if (!this.isL && (this.node.x > this.boardNode.width / 2)) {
            this.node.x -= this.boardNode.width;
        }

        if ((this.node.x < -this.boardNode.width / 2) ||
            (this.node.x > this.boardNode.width / 2) ||
            (this.node.y < -this.boardNode.height / 2)) {
            return false;
        }
        return true;
    },

    onCollisionEnter: function (other, self) {
        if (this.collided || (this.node.y > 168)) { // collided or colliding sun
            return;
        }

        this.collided = true;
        this.explode();
    },

    explode: function () {
        var expbg = cc.instantiate(
            this.node.parent.getComponent("game").explosionbgPrefab);
        this.node.parent.addChild(expbg);
        expbg.setSiblingIndex(this.node.getSiblingIndex());
        expbg.setPosition(this.node.x, this.node.y);

        this.node.getComponent(cc.Animation).play("explosion-banana");
    },
});
