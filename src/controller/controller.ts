import { Ball, Coordinate, BallDirection } from "../ball/ball.js";
import { BlockType, Block } from "../block/baseBl.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
import { Map } from "../map/map.js";
import { KeyboardObserver } from "./key.js";

type BallConstructor = {
    new(x:number, y:number, width:number, height: number): Ball;
}

type MapConstructor = {
    new(): Map
}

type CrashInfo = {
    block: Block,
    dir: BallDirection
}



export class Controller {

    private _ball: Ball
    private _canvas: HTMLCanvasElement;
    private _intervalId: number = 0;
    private _map: Map;
    private _prevCoordinate: Coordinate

    protected _keyObserver: KeyboardObserver = new KeyboardObserver();

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
            if(prevY === curY) {return x}
            else return ((prevX - curX)/(prevY - curY))*(y-prevY) + prevX
        }
        if(prevX === curX) {return y}
        else return ((prevY - curY)/(prevX - curX))*(x-prevX) + prevY
    }

    
    // private recursiveTrace(
    //     h_d: "right"|"center"|"left", v_d: "up"|"down"|"center",
    //     x= h_d === "right" ? Math.floor((this._prevCoordinate.x+this._ball.r)/BLOCK_WIDTH) : 
    //     h_d === "left" ? Math.floor((this._prevCoordinate.x-this._ball.r)/BLOCK_WIDTH) : Math.floor(this._prevCoordinate.x/BLOCK_WIDTH), 
    //     y= v_d === "down" ? Math.floor((this._prevCoordinate.y+this._ball.r)/BLOCK_HEIGHT) : 
    //     v_d === "up" ? Math.floor((this._prevCoordinate.y-this._ball.r)/BLOCK_HEIGHT) : Math.floor((this._prevCoordinate.y)/BLOCK_HEIGHT), 
    //     xOf:1|0|-1=0, yOf:1|0|-1=0
    //     ):CrashInfo|false {
    //     // if(traceStart) console.log(traceStart)
        
        
    //     //recursion end point
    //     if(h_d === "center" && v_d === "center") {
            
    //         return false;
    //     }
        
    //     if(xOf === 1) {
    //         if(x*BLOCK_WIDTH - this._ball.r > this._ball.x) {
    //             // console.log('not crashed')
    //             return false;
    //         }
    //     }
    //     else if(xOf === -1) {
    //         if((x+1)*BLOCK_WIDTH + this._ball.r < this._ball.x) {
    //             // console.log('not crashed')
    //             return false;
    //         }
    //     }
    //     else {
    //         if(yOf === 1) {
                
    //             if(y*BLOCK_HEIGHT-this._ball.r > this._ball.y) {
    //                 // console.log('not crashed')
    //                 return false;
    //             }
    //         }
    //         else if(yOf === -1 ){
                
    //             if((y+1)*BLOCK_HEIGHT+this._ball.r < this._ball.y) {
    //                 // console.log('not crashed')
    //                 return false;
    //             }
    //         } else {
            
    //         }
    //     }
        

    //     const curGridOnTrace = this._map.matrix[y][x]

        
    //     if(curGridOnTrace) {
    //         console.log('crashed')
    //         console.log(x,y,xOf,yOf)
    //         switch(xOf) {
    //             case 0:
    //                 if(yOf === 1) return {block: curGridOnTrace, dir: 'down'}
    //                 else if(yOf === -1) return {block: curGridOnTrace, dir: "up"}
    //                 else {
    //                     // let dir:BallDirection;
    //                     // if(this._ball.y + this._ball.r === curGridOnTrace.y) dir = "down"
    //                     // else if(this._ball.y - this._ball.r === curGridOnTrace.y + curGridOnTrace.height) dir = "up"
    //                     // else if(this._ball.x + this._ball.r === curGridOnTrace.x) dir = "right";
    //                     // else if(this._ball.x - this._ball.r === curGridOnTrace.x + curGridOnTrace.width) dir = "left"
    //                     // else throw new Error("unvalid judge")
    //                     // return {block: curGridOnTrace, dir: dir}
    //                 }
                    
    //             case 1:
    //                 if(yOf === 0) return {block: curGridOnTrace, dir: "right"}
    //                 else throw new Error(`${xOf}, invalid`); 

    //             case -1:
    //                 if(yOf === 0) return {block: curGridOnTrace, dir: "left"}
    //                 else throw new Error(`${xOf}, invalid`);
    //         }
    //     }
    //     else {
    //         let x_step:0|-1|1, y_step: 0|-1|1
            
    //         switch(h_d) {
    //             case "right":
    //                 if(v_d === "down") {
    //                     if(this.ballTrack((x+1)*BLOCK_WIDTH,y*BLOCK_HEIGHT)+this._ball.r <= (y+1)*BLOCK_HEIGHT) {
    //                         const sub = this._map.matrix[y+1][x]
    //                         if(sub && this._ball.y + this._ball.r >= sub!.y)
    //                         return {block: sub, dir:"down"}
    //                         x_step = 1; y_step = 0;
    //                     }
    //                     else {
    //                         const sub = this._map.matrix[y][x+1]
    //                         if(sub && this._ball.x + this._ball.r >= sub!.x)
    //                         return {block: sub, dir: "right"}
    //                         x_step = 0; y_step = 1;
    //                     }
    //                 }

    //                 else if(v_d === "up") {
    //                     if(this.ballTrack((x+1)*BLOCK_WIDTH,y*BLOCK_HEIGHT)-this._ball.r > y*BLOCK_HEIGHT) {
    //                         const sub = this._map.matrix[y-1][x];
    //                         if(sub && this._ball.y - this._ball.r <= sub!.y + sub!.height)
    //                         return {block: sub, dir: "up"}
    //                         x_step = 1; y_step = 0
    //                     }
    //                     else {
    //                         const sub = this._map.matrix[y][x+1];
    //                         if(sub && this._ball.x + this._ball.r >= sub!.x)
    //                         return {block: sub, dir: "right"}
    //                         x_step = 0; y_step = -1
    //                     }
    //                 }
    //                 else {
    //                     x_step = 1; y_step = 0;
    //                 }
    //                 break;
    //             case "left":
    //                 if(v_d === "down") {
    //                     if(this.ballTrack(x*BLOCK_WIDTH, y*BLOCK_HEIGHT) + this._ball.r<= (y+1)*BLOCK_HEIGHT) {
    //                         const sub = this._map.matrix[y+1][x]
    //                         if(sub && this._ball.y + this._ball.r >= sub!.y)
    //                         return {block: sub, dir: "down"}
    //                         x_step = -1; y_step = 0;
    //                     }
    //                     else {
    //                         const sub = this._map.matrix[y][x-1]
    //                         if(sub && this._ball.x - this._ball.r <= sub!.x+sub!.width)
    //                         return {block: sub, dir: "left"}
    //                         x_step = 0; y_step = 1;
    //                     }
    //                 }
    //                 else if(v_d === "up") {
    //                     if(this.ballTrack(x*BLOCK_WIDTH,y*BLOCK_HEIGHT) - this._ball.r>= y*BLOCK_HEIGHT) {
    //                         const sub = this._map.matrix[y-1][x]
    //                         if(sub && this._ball.y - this._ball.r <= sub!.y+sub!.height) 
    //                         return {block: sub, dir: "up"}
    //                         x_step = -1; y_step = 0;
    //                     }
    //                     else {
    //                         const sub = this._map.matrix[y][x-1]
    //                         if(sub && this._ball.x - this._ball.r <= sub!.x + sub!.width)
    //                         return {block: sub, dir: "left"}
    //                         x_step = 0; y_step = -1
    //                     }
    //                 }
    //                 else {
    //                     x_step = -1; y_step = 0;
    //                 }
    //                 break;
    //             case "center":
    //                 if(v_d === 'up') {x_step = 0; y_step = -1;}
    //                 else if(v_d === 'down') {x_step = 0; y_step = 1;}
    //                 else {x_step = 0; y_step = 0;}
    //                 break;
    //         }
            
            
            
    //         return this.recursiveTrace(h_d, v_d, x+x_step, y+y_step, x_step, y_step)        
            
    //     }


    // }

    renderAnimation() {
        const animStep = (time: DOMHighResTimeStamp) => {
            if(this) {
                this._canvas.getContext("2d")?.reset()
                this._ball.bounce()
                this.ball_h_acc();
                this.ball_h_move()
                this.newJudgeBallCrash();
    
                this.renderBall();
                this.renderMap();

                this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
            }
            window.requestAnimationFrame(animStep)
        }
        window.requestAnimationFrame(animStep)
    }

    ballCrashInfo():CrashInfo|false {
        const [m_left, m_right, m_up, m_down] = [
            this._ball.x - this._ball.r,
            this._ball.x + this._ball.r,
            this._ball.y - this._ball.r,
            this._ball.y + this._ball.r
        ]

        if(this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)])
        return {block:this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] as Block, dir: "down"}

        if(this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)])
        return {block: this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] as Block, dir: "up"}

        if(this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_left/BLOCK_WIDTH)])
        return {block: this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_left/BLOCK_WIDTH)] as Block, dir: "left"}

        if(this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_right/BLOCK_WIDTH)])
        return {block: this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_right/BLOCK_WIDTH)] as Block, dir: "right"}
        
        return false
    }

    newJudgeBallCrash() {
        const crashed = this.ballCrashInfo();
        if(!crashed) return false
        console.log(crashed)
        const point:Coordinate = {x: this._ball.x, y: this._ball.y}
        
        switch(crashed.dir) {
            case "down":
                point.y = crashed.block.y - this._ball.r
            
                if(this._prevCoordinate.x !== this._ball.x) {
                    point.x = this.ballTrack(this._ball.x, point.y, true)    
                }
                break;
            case "up":
                point.y = crashed.block.y + crashed.block.height + this._ball.r;
                if(this._prevCoordinate.x !== this._ball.x) {
                    point.x = this.ballTrack(this._ball.x, point.y, true)
                }
                break;
            case "right":
                point.x = crashed.block.x - this._ball.r;
                if(this._prevCoordinate.y !== this._ball.y) {
                    point.y = this.ballTrack(point.x, this._ball.y);
                }
                break;
            case "left":
                point.x = crashed.block.x + crashed.block.width +this._ball.r;
                if(this._prevCoordinate.y !== this._ball.y) {
                    point.y = this.ballTrack(point.x, this._ball.y)
                }
                break;
        }
        this._ball.crash(crashed.dir, point)
        
    }


    // judgeBallCrash() {
    //     let h_d: 'left'|'right'|'center'; let v_d: 'up'|'down'|'center'

    //     if(this._ball.x > this._prevCoordinate.x) h_d = 'right';
    //     else if(this._ball.x === this._prevCoordinate.x) h_d = 'center';
    //     else h_d = 'left';

    //     if(this._ball.y > this._prevCoordinate.y) v_d = 'down';
    //     else if(this._ball.y === this._prevCoordinate.y) v_d = 'center';
    //     else v_d = 'up'


    //     const crashed = this.recursiveTrace(h_d, v_d);
        
        

    //     const point:Coordinate = {x: this._ball.x, y: this._ball.y}

    //     if(crashed) {
    //         switch(crashed.dir) {
    //             case "down":
    //                 point.y = crashed.block.y - this._ball.r
                
                    
    //                 if(this._prevCoordinate.x !== this._ball.x) {
    //                     point.x = this.ballTrack(this._ball.x, point.y, true)    
    //                 }
    //                 break;
    //             case "up":
    //                 point.y = crashed.block.y + crashed.block.height + this._ball.r;
    //                 if(this._prevCoordinate.x !== this._ball.x) {
    //                     point.x = this.ballTrack(this._ball.x, point.y, true)
    //                 }
    //                 break;
    //             case "right":
    //                 point.x = crashed.block.x - this._ball.r;
    //                 if(this._prevCoordinate.y !== this._ball.y) {
    //                     point.y = this.ballTrack(point.x, this._ball.y);
    //                 }
    //                 break;
    //             case "left":
    //                 point.x = crashed.block.x + crashed.block.width +this._ball.r;
    //                 if(this._prevCoordinate.y !== this._ball.y) {
    //                     point.y = this.ballTrack(point.x, this._ball.y)
    //                 }
    //                 break;
    //         }
    //         this._ball.crash(crashed.dir, point)
    //     }
        
    // }

    // registerRenderInterval() {
    //     this._intervalId = setInterval(()=>{
    //         this._canvas.getContext("2d")?.reset()
    //         this._ball.bounce()
    //         this.ball_h_acc();
    //         this.ball_h_move()

    //         this.judgeBallCrash();
            

    //         this.renderBall();
    //         this.renderMap();
            

    //         this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
    //     },50)
    // }

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
    }

    ball_h_acc() {
        if(this._keyObserver.right) this._ball.move("right");
        if(this._keyObserver.left) this._ball.move("left");
        if(!this._keyObserver.right && !this._keyObserver.left) this._ball.h_stop();
    }

    ball_h_move() {
        this._ball.h_move()
    }



    protected attachCanvas(root: HTMLElement) {
        root.appendChild(this._canvas);
    }
}