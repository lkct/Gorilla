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

    handUp: function (other = false) {
        this.node.getComponent(cc.Animation)
            .play("handup" + ((this.isL ^ other) ? "L" : "R"));
    },

    dance: function (repeat = 3) {
        var self = this;
        var anim = this.node.getComponent(cc.Animation);
        for (let i = 0; i < repeat; i++) {
            anim.scheduleOnce(function () {
                this.play("handup" + (self.isL ? "L" : "R"));
            }, i);
            anim.scheduleOnce(function () {
                this.play("handup" + (!self.isL ? "L" : "R"));
            }, i + 0.5);
        }
    },

    throw: function (angle, speed, bananaPrefab) {
        this.handUp();

        var banana = cc.instantiate(bananaPrefab);
        banana.name = "banana";
        this.node.parent.addChild(banana);
        banana.setSiblingIndex(
            this.node.parent.getChildByName("gorillaL").getSiblingIndex());
        banana.setPosition(this.node.x - 8 * (this.isL ? 1 : -1),
            this.node.y + 36);
        banana.getComponent("banana").isL = this.isL;
        angle = angle / 180 * Math.PI;
        banana.getComponent("banana").speedX = speed * Math.cos(angle);
        banana.getComponent("banana").speedY = speed * Math.sin(angle);
    },

    onCollisionEnter: function (other, self) {
        this.node.group = "default";
        this.explode();

        this.node.parent.getChildByName("gorilla" + ((!this.isL) ? "L" : "R"))
            .getComponent("gorilla").dance();
        this.node.parent.getComponent("game").dancing = (!this.isL) ? "L" : "R";
        this.node.parent.getComponent("game").isBananaStage = false;
    },

    explode: function () {
        var expbg = cc.instantiate(
            this.node.parent.getComponent("game").explosionbgPrefab);
        this.node.parent.addChild(expbg);
        expbg.setSiblingIndex(this.node.getSiblingIndex());
        expbg.setPosition(this.node.x, this.node.y + 14.5);
        expbg.setScale(6);

        this.node.getComponent(cc.Animation).play("explosion-gorilla");
    },
});
