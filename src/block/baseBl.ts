import { GameObject } from "../baseObj.js";

export type BlockType = 'Normal'|'Jump'|'Fragile'|'WormholeStart'|'WormholeEnd'
type BlockRenderSetting = {
    innerColor: string,
    outerColor: string,
    paddingRatio: number
}

type BlockSettingSet = {
    [k in BlockType]: BlockRenderSetting
}

type WormholeStartAdditionalSetting = {
    start: boolean,
    x_endPoint: number,
    y_endPoint: number
}

type WormholeEndAdditionalSetting = Pick<WormholeStartAdditionalSetting, "start">

export type BlockAdditionalSetting<T extends BlockType> = T extends 'WormholeStart' ? 
WormholeStartAdditionalSetting : T extends "WormholeEnd" ? 
WormholeEndAdditionalSetting : never

 

const BLOCK_SETTING:Readonly<BlockSettingSet> = Object.freeze({
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
    }
})

interface BlockI<T extends BlockType> {
    get renderSetting(): BlockRenderSetting
    get type(): BlockType
    get opt(): BlockAdditionalSetting<T>|never
}




export class Block<T extends BlockType> extends GameObject implements BlockI<T> {
    private _renderSetting: BlockRenderSetting
    private _type: BlockType
    private _opt?: BlockAdditionalSetting<T>
    
    constructor(x:number, y:number, width: number, height: number, type: BlockType, opt?: BlockAdditionalSetting<T>) {
        super(x,y,width,height)
        this._type = type;
        this._renderSetting = BLOCK_SETTING[type]
        if(opt) this._opt = opt
    }

    get renderSetting() {
        return this._renderSetting
    } 
    get type() {
        return this._type
    }

    get opt() {
        if(this._opt) return this._opt
        throw new Error("additional option is not defined!!")
    }
}