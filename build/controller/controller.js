import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
export class Controller {
    constructor(ball, map) {
        this._intervalId = 0;
        this._canvas = document.createElement('canvas');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._canvas.style.backgroundColor = 'black';
        this._ball = new ball(10, 100, 5, 5);
        this._map = new map();
    }
    judgeBallCrash() {
        if (this._ball.y + this._ball.r >= this._canvas.height)
            this._ball.crash("down", { x: 10, y: this._canvas.height });
    }
    registerRenderInterval() {
        this._intervalId = setInterval(() => {
            var _a;
            (_a = this._canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.reset();
            this._ball.bounce();
            this.judgeBallCrash();
            this.renderBall();
            this.renderMap();
        }, 100);
    }
    renderBall() {
        const context = this._canvas.getContext("2d");
        context.fillStyle = "yellow";
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r, 0, 0, 360);
        context.fill();
    }
    renderMap() {
        const context = this._canvas.getContext("2d");
        this._map.matrix.forEach(row => {
            row.forEach(e => {
                if (e) {
                    context.fillStyle = e.renderSetting.outerColor;
                    context.fillRect(e.x, e.y, e.width, e.height);
                    context.fillStyle = e.renderSetting.innerColor;
                    const [x_padding, y_padding] = [e.width / e.renderSetting.paddingRatio, e.height / e.renderSetting.paddingRatio];
                    context.fillRect(e.x + x_padding, e.y + y_padding, e.width - 2 * x_padding, e.height - 2 * y_padding);
                }
            });
        });
    }
    generateBlock(x, y, w, h, type) {
        this._map.pushBlock(x, y, w, h, type);
        console.log("block generated");
    }
    attachCanvas(root) {
        root.appendChild(this._canvas);
    }
}
