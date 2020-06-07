// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        is_l: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.is_hand_up = false;
        this.is_other_up = false;
    },

    start: function () {
    },

    update: function (dt) {
    },

    getResPath: function (is_up, other) {
        var is_l = this.is_l ^ other;
        var respost = "";
        if (is_up) {
            respost = "-r";
            if (is_l) {
                respost = "-l";
            }
        }
        return "textures/gorilla" + respost;
    },

    handUp: function (is_up, other = false) {
        if ((is_up == this.is_hand_up) && ((other == this.is_other_up) || !is_up)) {
            return
        }
        var self = this;
        cc.loader.loadRes(this.getResPath(is_up, other), cc.SpriteFrame,
            function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        );
        cc.loader.releaseRes(this.getResPath(this.is_hand_up, this.is_other_up),
            cc.SpriteFrame);
        this.is_hand_up = is_up;
        this.is_other_up = other;
    }
});
