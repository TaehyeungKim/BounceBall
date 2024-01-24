import { GameObject } from "../baseObj.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../constant.js";
import { RightArrow, LeftArrow } from "../image/image.js";

export type BlockType = 'Normal'|'Jump'|'Fragile'|'WormholeStart'|'WormholeEnd'|"End"|"Bomb"|"FlyRight"|"FlyLeft"
export type ColorFuncByTimeStamp = (time: DOMHighResTimeStamp)=>string
export type PaddingFuncByTimeStamp = (time: DOMHighResTimeStamp) => number

type BlockRenderSetting = {
    innerColor: string|ColorFuncByTimeStamp
    outerColor: string|ColorFuncByTimeStamp,
    paddingRatio: number|PaddingFuncByTimeStamp,
    image?: HTMLImageElement
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
        paddingRatio: time=>{
            if(time%2000 < 1000) return (1/3000*(time%2000))
            else return -1/3000*(time%2000)+2/3
        }
    },
    WormholeEnd: {
        innerColor: "#c9b2e1",
        outerColor: "white",
        paddingRatio: 10
    },
    End: {
        outerColor: time=>{
            if(time%2000 < 1000) return `rgb(${(time%2000)*255/1000}, ${(time%2000)*255/1000}, 255)`
            else return `rgb(${255*2- (time%2000)*255/1000}, ${255*2- (time%2000)*255/1000}, 255)`
        },
        innerColor: "black",
        paddingRatio: 0
    },
    Bomb: {
        innerColor:"red",
        outerColor:"white",
        paddingRatio: 10
    },
    FlyRight: {
        innerColor: "#FFF7F2",
        outerColor: "#FF6D16",
        paddingRatio: 10,
        image: RightArrow
    },
    FlyLeft: {
        innerColor: "#FFF7F2",
        outerColor: "#FF6D16",
        paddingRatio: 10,
        image: LeftArrow
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

        if(this._opt) return this._opt
        else throw new Error("additional option is not defined!!")
    }
}