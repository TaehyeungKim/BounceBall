import { GameObject } from "../baseObj.js";
export class Ball extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._gs = 0.9;
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
                this.y += this._gs * this._gvs;
                this._gvs += 2;
                break;
            case "up":
                this.y += this._gs * this._gvs;
                this._gvs += 2;
                break;
            case "left":
                this.x += this._hvs;
                if (this._hvs > -Ball.MAX_HVS)
                    this._hvs -= 0.2;
                break;
            case "right":
                this.x += this._hvs;
                if (this._hvs < Ball.MAX_HVS)
                    this._hvs += 0.2;
        }
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
                this._gvs = -this._gvs;
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
Ball.MAX_GVS = 15;
Ball.MAX_HVS = 10;
