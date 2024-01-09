import { Ball, Coordinate } from "../ball/ball.js";
import { BlockType, Block } from "../block/baseBl.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
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
    private _map: Map;
    private _prevCoordinate: Coordinate

    constructor(ball: BallConstructor, map: MapConstructor) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._canvas.style.backgroundColor = 'black'
        this._ball = new ball(10,100,5,5);
        this._map = new map()

        this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
    }

    private ballTrack(x:number, y:number, reverse:boolean=false) {
        const {x: prevX, y: prevY} = this._prevCoordinate
        const [curX, curY] = [this._ball.x, this._ball.y]
        if(reverse) {
            if(prevY === curY) {return y}
            else return ((prevX - curX)/(prevY - curY))*(y-prevY) + prevX
        }
        if(prevX === curX) {return x}
        else return ((prevY - curY)/(prevX - curX))*(x-prevX) + prevY
    }

    private recursiveTrace(
        x=Math.floor(this._prevCoordinate.x/BLOCK_WIDTH), 
        y=Math.floor(this._prevCoordinate.y/BLOCK_HEIGHT), 
        xOf:1|0|-1=1, yOf=1):Block|false {


        if(xOf === 1) {
            if(x > Math.floor(this._ball.x/BLOCK_WIDTH)) return false;
        }
        else if(xOf === -1) {
            if(x < Math.floor(this._ball.x/BLOCK_WIDTH)) return false;
        }
        else {
            if(yOf === 1) {
                if(y > Math.floor(this._ball.y/BLOCK_HEIGHT)) return false;
            }
            else if(yOf === -1 ){
                if(y < Math.floor(this._ball.y/BLOCK_HEIGHT)) return false;
            }
        }


        if(yOf === 1) {
            if(y > Math.floor(this._ball.y/BLOCK_HEIGHT)) return false;
        }
        else if(yOf === -1) {
            if(y < Math.floor(this._ball.y/BLOCK_HEIGHT)) return false;
        }
        else {
            if(xOf === 1) {
                if(x > Math.floor(this._ball.x/BLOCK_WIDTH)) return false;
            }
            else if(xOf === -1) {
                if(x < Math.floor(this._ball.x/BLOCK_WIDTH)) return false;
            }
        }


        const curGridOnTrace = this._map.matrix[y][x]
        if(curGridOnTrace) return curGridOnTrace;
        else {
            // let [xOf, yOf] = [1,1];
            
            if(this._ball.x < this._prevCoordinate.x) xOf = -1;
            else if(this._ball.x === this._prevCoordinate.x) xOf = 0;

            if(this._ball.y < this._prevCoordinate.y) yOf = -1;
            else if(this._ball.y === this._prevCoordinate.y) yOf = 0;


            if(xOf === 0 || yOf === 0) return this.recursiveTrace(x+xOf, y+yOf, xOf, yOf);
        
            if(this.ballTrack(x+xOf, y) <= y+yOf)
            return this.recursiveTrace(x+xOf, y, xOf, yOf)
            else return this.recursiveTrace(x, y+yOf, xOf, yOf)
        }


    }



    judgeBallCrash() {
        const crashed = this.recursiveTrace();
        if(crashed) {
            this._ball.crash("down", {x: crashed.x, y: crashed.y})
            console.log(this._ball.x, this._ball.y)    
        }
        
    }

    registerRenderInterval() {
        this._intervalId = setInterval(()=>{
            this._canvas.getContext("2d")?.reset()
            this._ball.bounce()
            this.judgeBallCrash();
            this.renderBall();
            this.renderMap();

            this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
        },50)
    }

    renderStop() {
        clearInterval(this._intervalId)
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