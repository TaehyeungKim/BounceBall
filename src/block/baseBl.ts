import { GameObject } from "../baseObj.js";

export type BlockType = 'Normal'
type BlockRenderSetting = {
    innerColor: string,
    outerColor: string,
    paddingRatio: number
}

type BlockSettingSet = {
    [k in BlockType]: BlockRenderSetting
}

const BLOCK_SETTING:Readonly<BlockSettingSet> = Object.freeze({
    Normal: {
        innerColor: 'black',
        outerColor: 'white',
        paddingRatio: 10
    }
})

interface BlockI {
    get renderSetting(): BlockRenderSetting
    get type(): BlockType
}

export class Block extends GameObject implements BlockI {
    private _renderSetting: BlockRenderSetting
    private _type: BlockType
    
    constructor(x:number, y:number, width: number, height: number, type: BlockType) {
        super(x,y,width,height)
        this._type = type;
        this._renderSetting = BLOCK_SETTING[type]
    }

    get renderSetting() {
        return this._renderSetting
    } 
    get type() {
        return this._type
    }
}