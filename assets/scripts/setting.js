// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,
            this.onKeyUp, this);

        this.nextInput = "player1";
        this.lblCurrent = undefined;
        this.isInputNumber = false;
        this.isInputFloat = false;
        this.isEnterPressed = false;
        this.isCapsLocked = false;
        this.isShiftHolding = false;
        this.input1 = undefined;
        this.input2 = undefined;
        this.inputn = undefined;
        this.inputg = undefined;
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,
            this.onKeyUp, this);
    },

    start: function () {
    },

    update: function (dt) {
        this.processInput();
    },

    onKeyDown: function (event) {
        if (event.keyCode == cc.macro.KEY.capslock) {
            this.isCapsLocked = !this.isCapsLocked;
        }
        else if (event.keyCode == cc.macro.KEY.shift) {
            this.isShiftHolding = true;
        }

        if (this.nextInput == "presskey") {
            if (event.keyCode == cc.macro.KEY.p) {
                cc.find("main").getComponent("main").loadGame(
                    this.input1, this.input2, this.inputn, this.inputg);
            }
            else if (event.keyCode == cc.macro.KEY.q) {
                cc.game.end();
            }
        }

        if ((this.lblCurrent === undefined) || this.isEnterPressed) {
            return;
        }

        this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
        if ((event.keyCode == cc.macro.KEY.backspace) &&
            (this.lblCurrent.string.slice(-1) != " ")) {
            this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
        }

        else if (event.keyCode == cc.macro.KEY.enter) {
            this.isEnterPressed = true;
        }

        else if (((event.keyCode == cc.macro.KEY["."]) ||
            (event.keyCode == cc.macro.KEY.numdel)) &&
            !this.isShiftHolding && this.isInputFloat) {
            this.lblCurrent.string += ".";
        }

        else if ((event.keyCode >= cc.macro.KEY[0]) &&
            (event.keyCode <= cc.macro.KEY[9]) && !this.isShiftHolding) {
            this.lblCurrent.string += (event.keyCode - cc.macro.KEY[0]);
        }

        else if ((event.keyCode >= cc.macro.KEY.num0) &&
            (event.keyCode <= cc.macro.KEY.num9) && !this.isShiftHolding) {
            this.lblCurrent.string += (event.keyCode - cc.macro.KEY.num0);
        }

        else if ((event.keyCode >= cc.macro.KEY.a) &&
            (event.keyCode <= cc.macro.KEY.z) && !this.isInputNumber) {
            this.lblCurrent.string += String.fromCharCode(
                event.keyCode - cc.macro.KEY.a +
                ((this.isShiftHolding ^ this.isCapsLocked) ? "A".charCodeAt()
                    : "a".charCodeAt()));
        }

        var maxLen = this.lblCurrent.string.lastIndexOf(" ") + 1 + 12;
        if (this.lblCurrent.string.length > maxLen) {
            this.lblCurrent.string = this.lblCurrent.string.slice(0, maxLen);
        }
        this.lblCurrent.string += "_";
    },

    onKeyUp: function (event) {
        if (event.keyCode == cc.macro.KEY.shift) {
            this.isShiftHolding = false;
        }
    },

    processInput: function () {
        if (this.lblCurrent === undefined) {
            var lblNode = cc.find("Canvas/lbl-" + this.nextInput);
            lblNode.active = true;
            if (this.nextInput == "presskey") {
                return;
            }
            this.lblCurrent = lblNode.getComponent(cc.Label);
            this.lblCurrent.string += "_";
        }
        else if (this.isEnterPressed) {
            this.isEnterPressed = false;

            this.lblCurrent.string = this.lblCurrent.string.slice(0, -1);
            var inputPos = this.lblCurrent.string.lastIndexOf(" ") + 1;
            var input = this.lblCurrent.string.slice(inputPos);
            if (this.isInputNumber) {
                input = Number(input, 10);
                if (isNaN(input)) {
                    this.lblCurrent.string =
                        this.lblCurrent.string.slice(0, inputPos) + "_";
                    return; // illegal input
                }
            }

            switch (this.nextInput) {
                case "player1":
                    if (this.lblCurrent.string.length == inputPos) {
                        input = "Player 1";
                    }

                    this.input1 = input;

                    this.nextInput = "player2";
                    break;

                case "player2":
                    if (this.lblCurrent.string.length == inputPos) {
                        input = "Player 2";
                    }

                    this.input2 = input;

                    this.nextInput = "ngames";
                    this.isInputNumber = true;
                    break;

                case "ngames":
                    if (this.lblCurrent.string.length == inputPos) {
                        input = 3;
                    }

                    if ((input <= 0) || (input >= 100)) {
                        this.lblCurrent.string =
                            this.lblCurrent.string.slice(0, inputPos) + "_";
                        return; // illegal input
                    }

                    this.inputn = input;

                    this.nextInput = "gravity";
                    this.isInputFloat = true;
                    break;

                case "gravity":
                    if (this.lblCurrent.string.length == inputPos) {
                        input = 9.8;
                    }

                    if (input < 0) { // should not happen
                        this.lblCurrent.string =
                            this.lblCurrent.string.slice(0, inputPos) + "_";
                        return; // illegal input
                    }

                    this.inputg = input;

                    this.nextInput = "presskey";
                    break;

                default:
                    break;
            }

            this.lblCurrent = undefined;
        }
    },
});
