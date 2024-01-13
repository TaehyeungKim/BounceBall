import { GameObject } from "../baseObj.js";
export class Ball extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._gvs = 1;
        this._hvs = 0;
        this._gvs_end = Ball.MAX_GVS;
        this._hvs_end = Ball.MAX_HVS;
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
                if (this._hvs > -this._hvs_end)
                    this._hvs -= Ball._hvs_step;
                break;
            case "right":
                if (this._hvs < this._hvs_end)
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
                if (this._gvs > this._gvs_end)
                    this._gvs = this._gvs_end;
                break;
            case "down":
                this._gvs = -this._gvs_end;
                if (this._gvs < -this._gvs_end)
                    this._gvs = -this._gvs_end;
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
    get gvs_end() { return this._gvs_end; }
    get hvs_end() { return this._hvs_end; }
    updateGvsEnd(gvs) {
        this._gvs_end = gvs;
    }
    updateHvsEnd(hvs) {
        this._hvs_end = hvs;
    }
}
Ball._gs = 1.8;
Ball._hvs_step = 0.05;
Ball._gvs_step = 0.05;
Ball.MAX_GVS = 1.7;
Ball.MAX_HVS = 1.7;
