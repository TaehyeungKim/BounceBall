import { GameObject } from "../baseObj.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../constant.js";
const BLOCK_SETTING = Object.freeze({
    Normal: {
        innerColor: 'black',
        outerColor: 'white',
        paddingRatio: 10
    },
    Jump: {
        innerColor: "orange",
        outerColor: "orange",
        paddingRatio: 0
    },
    Fragile: {
        innerColor: "skyblue",
        outerColor: "white",
        paddingRatio: 10
    },
    WormholeStart: {
        innerColor: "#c9b2e1",
        outerColor: "yellow",
        paddingRatio: 4
    },
    WormholeEnd: {
        innerColor: "#c9b2e1",
        outerColor: "white",
        paddingRatio: 10
    },
    End: {
        outerColor: time => {
            if (time % 2000 < 1000)
                return `rgb(${(time % 2000) * 255 / 1000}, ${(time % 2000) * 255 / 1000}, 255)`;
            else
                return `rgb(${255 * 2 - (time % 2000) * 255 / 1000}, ${255 * 2 - (time % 2000) * 255 / 1000}, 255)`;
        },
        innerColor: "black",
        paddingRatio: 0
    },
    Bomb: {
        innerColor: "red",
        outerColor: "white",
        paddingRatio: 10
    }
});
export class Block extends GameObject {
    constructor(x, y, _type, _opt) {
        super(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
        this._type = _type;
        this._opt = _opt;
        this._renderSetting = BLOCK_SETTING[this._type];
    }
    get renderSetting() {
        return this._renderSetting;
    }
    get type() {
        return this._type;
    }
    get opt() {
        if (this._opt)
            return this._opt;
        else
            throw new Error("additional option is not defined!!");
    }
}
