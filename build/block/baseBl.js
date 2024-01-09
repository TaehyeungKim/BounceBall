import { GameObject } from "../baseObj.js";
const BLOCK_SETTING = Object.freeze({
    Normal: {
        innerColor: 'black',
        outerColor: 'white',
        paddingRatio: 10
    }
});
export class Block extends GameObject {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this._type = type;
        this._renderSetting = BLOCK_SETTING[type];
    }
    get renderSetting() {
        return this._renderSetting;
    }
    get type() {
        return this._type;
    }
}
