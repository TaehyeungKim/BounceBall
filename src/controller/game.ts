import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { AvailKey } from "./key.js";
import { stageBnd } from "../map/stage.js";


export class Game extends Controller {

    private _stage: number

    constructor() {
        super(Ball, Map)
        this._stage = 0;
    }

    play(root: HTMLElement) {
        this.attachCanvas(root)
        stageBnd[`stage_${this._stage}`](this.generateBlock.bind(this), this.initializeBall.bind(this))
        // for(let i = 0; i < (CANVAS_WIDTH/BLOCK_WIDTH); i++) {
        //     if(i === 10) this.generateBlock(i,11,BLOCK_WIDTH, BLOCK_HEIGHT, 'Jump')
        //     else if( i === 30) this.generateBlock(i,11,BLOCK_WIDTH, BLOCK_HEIGHT, 'Fragile')
        //     else this.generateBlock(i, 11, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal')
        // }
        // this.generateBlock(13, 9, BLOCK_WIDTH, BLOCK_HEIGHT, "WormholeStart", {
        //     start: true,
        //     x_endPoint: 13,
        //     y_endPoint: 22
        // });



        this.renderAnimation();

        window.addEventListener('keydown', (e:KeyboardEvent)=>{
            if(e.key === "ArrowLeft"||"ArrowRight"||"ArrowUp"||"ArorwDown") {
                const key = e.key as AvailKey
                this._keyObserver.keyToggle(key,true)
            }
        })
        window.addEventListener('keyup', (e:KeyboardEvent)=>{
            if(e.key === "ArrowLeft"||"ArrowRight"||"ArrowUp"||"ArorwDown") {
                const key = e.key as AvailKey
                this._keyObserver.keyToggle(key,false)
            }
        }) 
            
    }

    toNextStage() {
        this._stage += 1;
    }

    toPrevStage() {
        this._stage -= 1;
    }
}
