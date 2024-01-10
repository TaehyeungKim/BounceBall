import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH, CANVAS_WIDTH } from "../constant.js";

export class Game extends Controller {
    constructor() {
        super(Ball, Map)
    }

    play(root: HTMLElement) {
        this.attachCanvas(root)
        for(let i = 0; i < (CANVAS_WIDTH/BLOCK_WIDTH); i++) {
            this.generateBlock(i,14,BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal')
            this.generateBlock(i,13,BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal')
        }
        this.registerRenderInterval();

        window.addEventListener('keydown', (e: KeyboardEvent)=>{
            switch(e.key) {
                case 'ArrowRight':
                    this.ballMove('right')
            }
        })
    }
}