import { Ball } from "../ball/ball.js";
import { BlockType } from "../block/baseBl.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { Map } from "../map/map.js";

type BallConstructor = {
    new(x:number, y:number, width:number, height: number): Ball;
}

type MapConstructor = {
    new(): Map
}



export class Controller {

    private _ball: Ball
    private _canvas: HTMLCanvasElement;
    private _intervalId: number = 0;
    private _map: Map

    constructor(ball: BallConstructor, map: MapConstructor) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._canvas.style.backgroundColor = 'black'
        this._ball = new ball(10,100,5,5);
        this._map = new map()
    }

    judgeBallCrash() {
        if(this._ball.y + this._ball.r >= this._canvas.height) this._ball.crash("down", {x: 10,y: this._canvas.height})
    }

    registerRenderInterval() {
        this._intervalId = setInterval(()=>{
            this._canvas.getContext("2d")?.reset()
            this._ball.bounce()
            this.judgeBallCrash();
            this.renderBall();
            this.renderMap();
        },100)
    }

    renderBall() {
        const context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        context.fillStyle = "yellow"
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r,0,0,360)
        context.fill()
    }

    renderMap() {
        const context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        this._map.matrix.forEach(row=>{
            row.forEach(e=>{
                if(e) {
                    context.fillStyle = e.renderSetting.outerColor;
                    context.fillRect(e.x, e.y, e.width, e.height);

                    context.fillStyle = e.renderSetting.innerColor;
                    const [x_padding, y_padding] = [e.width/e.renderSetting.paddingRatio,e.height/e.renderSetting.paddingRatio]
                    context.fillRect(e.x + x_padding, e.y + y_padding, e.width - 2*x_padding, e.height - 2*y_padding)
                } 
            })
        })
    }

    generateBlock(x:number, y:number, w:number, h:number, type: BlockType) {
        this._map.pushBlock(x,y,w,h,type)
        console.log("block generated")
    }



    protected attachCanvas(root: HTMLElement) {
        root.appendChild(this._canvas);
    }
}