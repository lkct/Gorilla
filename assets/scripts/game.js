// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

function rand() {
    return Math.random();
}
function randInt(a, b = undefined) {
    if (b === undefined) {
        b = a;
        a = 0;
    }
    return Math.floor(rand() * (b - a)) + a;
}

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
        dpm: 1, // dots per meter
        gorillaPrefab: {
            default: null,
            type: cc.Prefab
        },
        windowPrefab: {
            default: null,
            type: cc.Prefab
        },
        windowSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]     // type 同样写成数组，提高代码可读性
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.is_hand_up = false;
        this.time_stopped = 0.0;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this.spawnMap();
    },

    start: function () {
    },

    update: function (dt) {
        this.time_stopped += dt;
        // if (this.time_stopped > 1) {
        //     this.node.getChildByName("banana").getComponent("banana").move(this.time_stopped, 9.8);
        //     this.time_stopped = 0.0;
        // }
    },

    spawnMap: function () {
        var onThirdL = (rand() < 0.5);
        var onThirdR = (rand() < 0.5);
        var minLen = 3;
        var maxLen = 7;
        var rest = 60;
        for (let i = 0; i < 12; i++) {
            maxLen = Math.min(maxLen, rest - (11 - i) * minLen);
            minLen = Math.max(minLen, rest - (11 - i) * maxLen);
            x0 = (60 - rest) * 10 + (i + 1) * 3;
            width = randInt(minLen, maxLen + 1);
            height = randInt(1, 21);
            this.spawnBuilding(x0, width, height, randInt(3));
            if ((i == 2) && onThirdL || (i == 1) && !onThirdL) {
                this.spawnGorilla(x0 + width * 5, height * 13, true);
            }
            if ((i == 9) && onThirdR || (i == 10) && !onThirdR) {
                this.spawnGorilla(x0 + width * 5, height * 13, false);
            }
            rest -= width;
        }
    },

    spawnBuilding: function (x0, width, height, color) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.spawnWindow(x0 + i * 10, j * 13, color * 2 + randInt(2))
            }
        }
    },

    spawnWindow: function (x, y, texture) {
        var window = cc.instantiate(this.windowPrefab);
        this.node.addChild(window);
        window.setPosition(cc.v2(x - 320, y - 240));
        window.getComponent(cc.Sprite).spriteFrame =
            this.windowSpriteFrames[texture];
    },

    spawnGorilla: function (x, y, isL) {
        var gorilla = cc.instantiate(this.gorillaPrefab);
        this.node.addChild(gorilla);
        gorilla.setPosition(cc.v2(x - 320, y - 240));
        gorilla.getComponent('gorilla').isL = isL;
    },
});
