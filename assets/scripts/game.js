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
        gravity: 9.8, // m/s^2
        bananaPrefab: {
            default: null,
            type: cc.Prefab
        },
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
            type: [cc.SpriteFrame]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this.spawnMap();

        this.updatePeriod = 1.0;
        this.timeStopped = 0.0;
        this.isInputStage = true;
        this.isBananaStage = false;
        this.isDanceStage = false;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
        this.isLTurn = true;
        this.nextInput = "angle";
        this.lblCurrent = undefined;
        this.isEnterPressed = false;
        this.inputAngle = undefined;
        this.inputSpeed = undefined;
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
    },

    start: function () {
    },

    update: function (dt) {
        this.timeStopped += dt;
        if (this.timeStopped < this.updatePeriod) {
            return;
        }

        if (this.isInputStage) {
            this.processInput();
            if ((this.inputAngle !== undefined) &&
                (this.inputSpeed !== undefined)) {
                this.node.getChildByName("gorilla" + (this.isLTurn ? "L" : "R"))
                    .getComponent("gorilla")
                    .throw(this.inputAngle, this.inputSpeed, this.bananaPrefab);

                this.isInputStage = false;
                this.isBananaStage = true;
                this.inputAngle = undefined;
                this.inputSpeed = undefined;
            }
        }
        else if (this.isBananaStage) {
            var banana = this.node.getChildByName("banana");
            if (!banana.getComponent("banana")
                .move(this.timeStopped, this.gravity)) {
                banana.destroy();

                this.isBananaStage = false;
                this.isInputStage = true;
                this.isLTurn = !this.isLTurn;
            };
        }

        this.timeStopped = 0.0;
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
                this.spawnWindow(x0 + i * 10, j * 13, color * 2 + randInt(2));
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
        gorilla.name = "gorilla" + (isL ? "L" : "R");
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
                this.isEnterPressed = true;
                break;

            // case cc.macro.KEY["."]:
            // case cc.macro.KEY.numdel:
            //     this.lblCurrent.string += ".";
            //     break;

            case cc.macro.KEY["-"]:
            case cc.macro.KEY.dash:
                this.lblCurrent.string += "-";
                break;

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
    },

    processInput: function () {
        if (this.lblCurrent === undefined) {
            var lblNode = cc.find("Canvas/lbl-" + this.nextInput +
                (this.isLTurn ? "L" : "R"));
            lblNode.active = true;
            this.lblCurrent = lblNode.getComponent(cc.Label);
            this.lblCurrent.string += '_';
        }
        else if (this.isEnterPressed) {
            this.isEnterPressed = false;
            this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
            var input = Number(this.lblCurrent.string.slice(7), 10);
            if (isNaN(input) || (this.lblCurrent.string.length == 7)) {
                this.lblCurrent.string =
                    this.lblCurrent.string.slice(0, 7) + "_";
                return; // illegal input
            }

            if (this.nextInput == "angle") {
                if ((input >= 360) || (input <= -360)) {
                    this.lblCurrent.string =
                        this.lblCurrent.string.slice(0, 7) + "_";
                    return; // illegal input
                }

                this.inputAngle = input;

                this.nextInput = "speed";
            }
            else {
                if ((input >= 256) || (input <= -1)) {
                    this.lblCurrent.string =
                        this.lblCurrent.string.slice(0, 7) + "_";
                    return; // illegal input
                }

                this.inputSpeed = input;

                var lblNode = cc.find("Canvas/lbl-angle" +
                    (this.isLTurn ? "L" : "R"));
                lblNode.getComponent(cc.Label).string = "Angle: ";
                lblNode.active = false;
                lblNode = cc.find("Canvas/lbl-speed" +
                    (this.isLTurn ? "L" : "R"));
                lblNode.getComponent(cc.Label).string = "Speed: ";
                lblNode.active = false;

                this.nextInput = "angle";
            }
            this.lblCurrent = undefined;
        }
    }
});
