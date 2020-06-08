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
        this.timeStopped = 0.0;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this.spawnMap();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
        this.isLNext = true;
        this.nextInput = "angle";
        this.lblCurrent = undefined;
        this.isInputDone = false;
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
    },

    start: function () {
    },

    update: function (dt) {
        this.timeStopped += dt;
        if (this.timeStopped > 0.1) {
            // this.node.getChildByName("banana").getComponent("banana").move(this.timeStopped, 9.8);
            this.timeStopped = 0.0;
        }
        else {
            return;
        }
        if (this.lblCurrent === undefined) {
            this.lblCurrent = this.node.getChildByName("lbl-" + this.nextInput +
                (this.isLNext ? "L" : "R")).getComponent(cc.Label);
            this.lblCurrent.string += '_';
        }
        else if (this.isInputDone) {
            this.isInputDone = false;
            this.lblCurrent.string = this.lblCurrent.string.slice(0, -1)
            console.log(this.lblCurrent.string.slice(7));
            if (this.nextInput == "angle") {
                this.nextInput = "speed";
            }
            else {
                this.node.getChildByName("lbl-angle" +
                    (this.isLNext ? "L" : "R")).getComponent(cc.Label).string =
                    "Angle: ";
                this.node.getChildByName("lbl-speed" +
                    (this.isLNext ? "L" : "R")).getComponent(cc.Label).string =
                    "Speed: ";
                this.nextInput = "angle";
                this.isLNext = !this.isLNext;
            }
            this.lblCurrent = undefined;
        }
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
        window.setPosition(x - 320, y - 240);
        window.getComponent(cc.Sprite).spriteFrame =
            this.windowSpriteFrames[texture];
    },

    spawnGorilla: function (x, y, isL) {
        var gorilla = cc.instantiate(this.gorillaPrefab);
        this.node.addChild(gorilla);
        gorilla.setPosition(x - 320, y - 240);
        gorilla.getComponent("gorilla").isL = isL;
    },

    onKeyDown: function (event) {
        if (this.lblCurrent === undefined) {
            return;
        }
        this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
        switch (event.keyCode) {
            case cc.macro.KEY.backspace:
                this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
                break;
            case cc.macro.KEY.enter:
                this.isInputDone = true;
                break;
            // case cc.macro.KEY["."]:
            // case cc.macro.KEY.numdel:
            //     this.lblCurrent.string += ".";
            //     break;
            default:
                for (let i = 0; i < 10; i++) {
                    if (((event.keyCode == cc.macro.KEY[i]) ||
                        (event.keyCode == eval("cc.macro.KEY.num" + i))) &&
                        (this.lblCurrent.string.length < 12)) {
                        this.lblCurrent.string += i;
                    }
                }
                break;
        }
        this.lblCurrent.string += '_';
    }
});
