import { GameObject } from "../baseObj.js";
export class Ball extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._gvs = 1;
        this._hvs = 0;
        this._r = w / 2;
    }
    get r() {
        return this._r;
    }
    move(dir) {
        switch (dir) {
            case "down":
                this.y += Ball._gs * this._gvs;
                this._gvs += Ball._gvs_step;
                break;
            case "up":
                this.y += Ball._gs * this._gvs;
                this._gvs += Ball._gvs_step;
                break;
            case "left":
                // this.x += this._hvs; 
                if (this._hvs > -Ball.MAX_HVS)
                    this._hvs -= Ball._hvs_step;
                break;
            case "right":
                // this.x += this._hvs;
                if (this._hvs < Ball.MAX_HVS)
                    this._hvs += Ball._hvs_step;
                break;
        }
    }
    h_stop() {
        const step = Ball._hvs_step;
        if (this._hvs > 0) {
            if (this._hvs < step)
                this._hvs = 0;
            else
                this._hvs -= step;
        }
        else if (this._hvs < 0) {
            if (this._hvs > -step)
                this._hvs = 0;
            else
                this._hvs += step;
        }
    }
    h_move() {
        this.x += this._hvs;
    }
    bounce() {
        if (this._gvs > 0)
            this.move('down');
        else
            this.move('up');
    }
    crash(crashDir, point) {
        switch (crashDir) {
            case "up":
                this._gvs = -this._gvs;
                if (this._gvs > Ball.MAX_GVS)
                    this._gvs = Ball.MAX_GVS;
                break;
            case "down":
                // this._gvs = - this._gvs;
                this._gvs = -Ball.MAX_GVS;
                if (this._gvs < -Ball.MAX_GVS)
                    this._gvs = -Ball.MAX_GVS;
                break;
            case "left":
                this._hvs = -this._hvs;
                break;
            case "right":
                this._hvs = -this._hvs;
                break;
        }
        this.x = point.x;
        this.y = point.y;
    }
}
Ball._gs = 1.8;
Ball._hvs_step = 0.05;
Ball._gvs_step = 0.05;
Ball.MAX_GVS = 1.7;
Ball.MAX_HVS = 1.7;
