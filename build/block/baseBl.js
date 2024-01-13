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
        paddingRatio: 10
    },
    WormholeEnd: {
        innerColor: "#c9b2e1",
        outerColor: "white",
        paddingRatio: 10
    },
    End: {
        innerColor: "black",
        outerColor: "black",
        paddingRatio: 0
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
        console.log(this._opt, this._type);
        if (this._opt)
            return this._opt;
        else
            throw new Error("additional option is not defined!!");
    }
}
