export class Controller {
    constructor(ball) {
        this._intervalId = 0;
        this._canvas = document.createElement('canvas');
        this._canvas.width = 600;
        this._canvas.height = 300;
        this._canvas.style.backgroundColor = 'black';
        this._ball = new ball(10, 100, 5, 5);
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
        }, 100);
    }
    renderBall() {
        const context = this._canvas.getContext("2d");
        context.fillStyle = "yellow";
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r, 0, 0, 360);
        context.fill();
    }
    attachCanvas(root) {
        root.appendChild(this._canvas);
    }
}
