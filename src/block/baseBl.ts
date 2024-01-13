import { GameObject } from "../baseObj.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../constant.js";

export type BlockType = 'Normal'|'Jump'|'Fragile'|'WormholeStart'|'WormholeEnd'|"End"
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
    },
    End: {
        innerColor: "black",
        outerColor: "black",
        paddingRatio: 0
    }
})

interface BlockI<T extends BlockType> {
    get renderSetting(): BlockRenderSetting
    get type(): BlockType
    get opt(): BlockAdditionalSetting<T>|never
}




export class Block<T extends BlockType> extends GameObject implements BlockI<T> {
    private _renderSetting: BlockRenderSetting
    
    
    constructor(x:number, y:number, private _type: BlockType, private _opt?: BlockAdditionalSetting<T>) {
        super(x,y,BLOCK_WIDTH, BLOCK_HEIGHT)
        
        this._renderSetting = BLOCK_SETTING[this._type]
        
    }

    get renderSetting() {
        return this._renderSetting
    } 
    get type() {
        return this._type
    }

    get opt() {
        console.log(this._opt, this._type)
        if(this._opt) return this._opt
        else throw new Error("additional option is not defined!!")
    }
}