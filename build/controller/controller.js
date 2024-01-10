import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
export class Controller {
    constructor(ball, map) {
        this._intervalId = 0;
        this._canvas = document.createElement('canvas');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._canvas.style.backgroundColor = 'black';
        this._ball = new ball(10, 100, 5, 5);
        this._map = new map();
        this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
    }
    ballTrack(x, y, reverse = false) {
        const { x: prevX, y: prevY } = this._prevCoordinate;
        const [curX, curY] = [this._ball.x, this._ball.y];
        if (reverse) {
            if (prevY === curY) {
                return x;
            }
            else
                return ((prevX - curX) / (prevY - curY)) * (y - prevY) + prevX;
        }
        if (prevX === curX) {
            return y;
        }
        else
            return ((prevY - curY) / (prevX - curX)) * (x - prevX) + prevY;
    }
    recursiveTrace(h_d, v_d, x = Math.floor(this._prevCoordinate.x / BLOCK_WIDTH), y = Math.floor(this._prevCoordinate.y / BLOCK_HEIGHT), xOf = 0, yOf = 0) {
        //recursion end point
        if (h_d === "center" && v_d === "center")
            return false;
        if (xOf === 1) {
            if (x > Math.floor(this._ball.x / BLOCK_WIDTH))
                return false;
        }
        else if (xOf === -1) {
            if (x < Math.floor(this._ball.x / BLOCK_WIDTH))
                return false;
        }
        else {
            if (yOf === 1) {
                if (y > Math.floor(this._ball.y / BLOCK_HEIGHT))
                    return false;
            }
            else if (yOf === -1) {
                if (y < Math.floor(this._ball.y / BLOCK_HEIGHT))
                    return false;
            }
            else {
                //    xOf === 0, yOf === 0;
            }
        }
        const curGridOnTrace = this._map.matrix[y][x];
        if (curGridOnTrace) {
            console.log(this._ball.x, this._ball.y, xOf, yOf);
            switch (xOf) {
                case 0:
                    if (yOf === 1)
                        return { block: curGridOnTrace, dir: 'down' };
                    else if (yOf === -1)
                        return { block: curGridOnTrace, dir: "up" };
                    else {
                        console.log(x, y, xOf, yOf, h_d, v_d);
                        debugger;
                        throw new Error(`${xOf}, invalid`);
                    }
                case 1:
                    if (yOf === 0)
                        return { block: curGridOnTrace, dir: "left" };
                    else
                        throw new Error(`${xOf}, invalid`);
                case -1:
                    if (yOf === 0)
                        return { block: curGridOnTrace, dir: "right" };
                    else
                        throw new Error(`${xOf}, invalid`);
            }
        }
        else {
            let x_step, y_step;
            switch (h_d) {
                case "right":
                    if (v_d === "down") {
                        if (this.ballTrack(x + 1, y) <= y + 1) {
                            x_step = 1;
                            y_step = 0;
                        }
                        else {
                            x_step = 0;
                            y_step = 1;
                        }
                    }
                    else if (v_d === "up") {
                        if (this.ballTrack(x + 1, y) >= y) {
                            x_step = 1;
                            y_step = 0;
                        }
                        else {
                            x_step = 0;
                            y_step = -1;
                        }
                    }
                    else {
                        x_step = 1;
                        y_step = 0;
                    }
                    break;
                case "left":
                    if (v_d === "down") {
                        if (this.ballTrack(x, y) <= y) {
                            x_step = -1;
                            y_step = 0;
                        }
                        else {
                            x_step = 0;
                            y_step = 1;
                        }
                    }
                    else if (v_d === "up") {
                        if (this.ballTrack(x, y) >= y) {
                            x_step = -1;
                            y_step = 0;
                        }
                        else {
                            x_step = 0;
                            y_step = -1;
                        }
                    }
                    else {
                        x_step = -1;
                        y_step = 0;
                    }
                    break;
                case "center":
                    if (v_d === 'up') {
                        x_step = 0;
                        y_step = -1;
                    }
                    else if (v_d === 'down') {
                        x_step = 0;
                        y_step = 1;
                    }
                    else {
                        x_step = 0;
                        y_step = 0;
                    }
                    break;
            }
            return this.recursiveTrace(h_d, v_d, x + x_step, y + y_step, x_step, y_step);
        }
    }
    judgeBallCrash() {
        let h_d;
        let v_d;
        if (this._ball.x > this._prevCoordinate.x)
            h_d = 'right';
        else if (this._ball.x === this._prevCoordinate.x)
            h_d = 'center';
        else
            h_d = 'left';
        if (this._ball.y > this._prevCoordinate.y)
            v_d = 'down';
        else if (this._ball.y === this._prevCoordinate.y)
            v_d = 'center';
        else
            v_d = 'up';
        const crashed = this.recursiveTrace(h_d, v_d);
        const point = { x: this._ball.x, y: this._ball.y };
        if (crashed) {
            switch (crashed.dir) {
                case "down":
                    point.y = crashed.block.y - this._ball.r;
                    console.log(point.y);
                    if (this._prevCoordinate.x !== this._ball.x) {
                        point.x = this.ballTrack(this._ball.x, point.y, true);
                    }
                    break;
                case "up":
                    point.y = crashed.block.y * crashed.block.height + crashed.block.height + this._ball.r;
                    if (this._prevCoordinate.x !== this._ball.x) {
                        point.x = this.ballTrack(this._ball.x, point.y, true);
                    }
                    break;
                case "left":
                    point.x = crashed.block.x * crashed.block.width + crashed.block.width + this._ball.r;
                    if (this._prevCoordinate.y !== this._ball.y) {
                        point.y = this.ballTrack(point.x, this._ball.y);
                    }
                    break;
                case "right":
                    point.x = crashed.block.x * crashed.block.width - this._ball.r;
                    if (this._prevCoordinate.y !== this._ball.y) {
                        point.y = this.ballTrack(point.x, this._ball.y);
                    }
                    break;
            }
            this._ball.crash(crashed.dir, point);
        }
    }
    registerRenderInterval() {
        this._intervalId = setInterval(() => {
            var _a;
            (_a = this._canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.reset();
            this._ball.bounce();
            this.judgeBallCrash();
            this.renderBall();
            this.renderMap();
            this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
        }, 50);
    }
    renderStop() {
        clearInterval(this._intervalId);
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
    }
    ballMove(dir) {
        this._ball.move(dir);
    }
    attachCanvas(root) {
        root.appendChild(this._canvas);
    }
}
