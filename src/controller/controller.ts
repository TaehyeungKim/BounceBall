import { Ball } from "../ball/ball.js";

type BallConstructor = {
    new(x:number, y:number, width:number, height: number): Ball;
}

export class Controller {

    private _ball: Ball
    private _canvas: HTMLCanvasElement;
    private _intervalId: number = 0;

    constructor(ball: BallConstructor) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = 600;
        this._canvas.height = 300
        this._canvas.style.backgroundColor = 'black'
        this._ball = new ball(10,100,5,5);
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
        },100)
    }

    renderBall() {
        const context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        context.fillStyle = "yellow"
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r,0,0,360)
        context.fill()
    }

    protected attachCanvas(root: HTMLElement) {
        root.appendChild(this._canvas);
    }
}