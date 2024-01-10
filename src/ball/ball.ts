import { GameObject } from "../baseObj.js";

export type BallDirection = 'up'|'down'|'left'|'right'
export type Coordinate = {x: number, y: number}

export class Ball extends GameObject {
    private _gs: number = 0.9;
    private _gvs: number = 1;
    private _hvs: number = 0;
    private _r: number

    private static MAX_GVS = 15;
    private static MAX_HVS = 10;

    constructor(x:number,y:number,w:number,h:number) {
        super(x,y,w,h)
        this._r = w/2
    }

    get r(){
        return this._r
    }

    move(dir: BallDirection) {
        switch(dir) {
            case "down":                
                this.y += this._gs * this._gvs;
                this._gvs += 2;
                break;
            case "up":
                this.y += this._gs * this._gvs;
                this._gvs += 2;
                break;
            case "left":
                this.x += this._hvs;
                if(this._hvs > -Ball.MAX_HVS) this._hvs -= 0.2;
                break;
            case "right":
                this.x += this._hvs;
                
                if(this._hvs < Ball.MAX_HVS) this._hvs += 0.2;
        }
    }
    
    bounce() {
        if(this._gvs > 0) this.move('down');
        else this.move('up');
    }

    crash(crashDir: BallDirection, point: Coordinate) {
        switch(crashDir) {
            case "up":
                this._gvs = -this._gvs;
                if(this._gvs > Ball.MAX_GVS) this._gvs = Ball.MAX_GVS;
                
                break;
            case "down":
                this._gvs = - this._gvs;
                
                if(this._gvs < -Ball.MAX_GVS) this._gvs = -Ball.MAX_GVS;
                
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

}