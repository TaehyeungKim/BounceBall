import { GameObject } from "../baseObj.js";
import { SpecialBallMove } from "../controller/controller.js";

export type BallDirection = 'up'|'down'|'left'|'right'
export type Coordinate = {x: number, y: number}


export class Ball extends GameObject {
    private static _gs: number = 1.8;
    private _gvs: number = 1;
    private _hvs: number = 0;
    private static _hvs_step: number = 0.05;
    private static _gvs_step: number = 0.05
    private _r: number
    private _flyStatus: Extract<SpecialBallMove, "FlyLeft"|"FlyRight">|false

    static readonly MAX_GVS = 1.7;
    static readonly MAX_HVS = 1.7;

    private _gvs_end = Ball.MAX_GVS;
    private _hvs_end = Ball.MAX_HVS;

    constructor(x:number,y:number,w:number,h:number) {
        super(x,y,w,h)
        this._r = w/2
        this._flyStatus = false;
    }

    get r(){
        return this._r
    }

    get flyStatus() {
        return this._flyStatus
    }

    set flyStatus(status: Extract<SpecialBallMove, "FlyLeft"|"FlyRight">|false) {
        this._flyStatus = status
    }

    fly(dir: Extract<SpecialBallMove, "FlyLeft"|"FlyRight">) {
        
        this._gvs = 0;
        
        if(dir === "FlyLeft") {
            this._hvs = -Ball.MAX_HVS;
            this.move("left");
        } else {
            this._hvs = Ball.MAX_HVS;
            this.move("right");
        }
        
        
    }

    move(dir: BallDirection) {
        switch(dir) {
            case "down":
            case "up": this.y += Ball._gs * this._gvs; this._gvs += Ball._gvs_step;break;
            case "left": 
                // this.x += this._hvs; 
                if(this._hvs > -this._hvs_end) this._hvs -= Ball._hvs_step;
                
                break;
            case "right":
                // this.x += this._hvs;
                if(this._hvs < this._hvs_end) this._hvs += Ball._hvs_step;
                console.log(this._hvs)
                
                break;
        }
    }

    h_stop() {
        const step = Ball._hvs_step
        if(this._hvs > 0) {
            if(this._hvs < step) this._hvs = 0;
            else this._hvs -= step; 
        }
        else if(this._hvs < 0) {
            if(this._hvs > -step) this._hvs = 0;
            else this._hvs += step;
        }
    }

    h_move() {
        this.x += this._hvs;
    }
    
    bounce() {
        if(this._gvs > 0) this.move('down');
        else this.move('up');
    }

    jumpOnTheWall(dir: BallDirection) {
        switch(dir) {
            case "left":
                this._gvs = -Ball.MAX_GVS;
                this._hvs = -Ball.MAX_HVS;
                
                break;
            case "right":
                this._gvs = -Ball.MAX_GVS;
                this._hvs = Ball.MAX_HVS;
                
        }
    }

    crash(crashDir: BallDirection, point: Coordinate) {
        switch(crashDir) {
            case "up":
                this._gvs = -this._gvs;
                
                if(this._gvs > this._gvs_end) this._gvs = this._gvs_end;
                
                break;
            case "down":
                
                this._gvs = -this._gvs_end;
                
                if(this._gvs < -this._gvs_end) this._gvs = -this._gvs_end;
                
                break;
            case "left":
                this._hvs = - this._hvs;
                
                break;
            case "right":
                this._hvs = - this._hvs;
                
                break;
        }
        this.x = point.x; this.y = point.y
    }

    get gvs_end() {return this._gvs_end}
    get hvs_end() {return this._hvs_end}

    updateGvsEnd(gvs: number) {
        this._gvs_end = gvs
    }

    updateHvsEnd(hvs: number) {
        this._hvs_end = hvs;
    }

    initializeBall(coord: Coordinate) {
        this.x = coord.x; this.y = coord.y
        this._gvs = 0; this._hvs = 0;
    }

}