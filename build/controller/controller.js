import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
import { KeyboardObserver } from "./key.js";
export class Controller {
    constructor(ball, map) {
        this._intervalId = 0;
        this._keyObserver = new KeyboardObserver();
        this._canvas = document.createElement('canvas');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._canvas.style.backgroundColor = 'black';
        this._ball = new ball(10, 100, 5, 5);
        this._map = new map();
        this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
    }
    marginBallTrack(x, y, dir) {
        const a = (this._prevCoordinate.y - this._ball.y) / (this._prevCoordinate.x - this._ball.x);
        if (dir === "up")
            return this.ballTrack(x, y) - this._ball.r * Math.sqrt(a ** 2 + 1);
        return this.ballTrack(x, y) + this._ball.r * Math.sqrt(a ** 2 + 1);
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
    renderAnimation() {
        const animStep = (time) => {
            var _a;
            if (this) {
                (_a = this._canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.reset();
                this._ball.bounce();
                this.ball_h_acc();
                this.ball_h_move();
                this.newJudgeBallCrash();
                this.renderBall();
                this.renderMap();
            }
            window.requestAnimationFrame(animStep);
        };
        window.requestAnimationFrame(animStep);
    }
    ballCrashInfo(h_d, v_d) {
        const a = (this._prevCoordinate.y - this._ball.y) / (this._prevCoordinate.x - this._ball.x);
        const xOf = a * this._ball.r / Math.sqrt(a ** 2 + 1);
        switch (h_d) {
            case "right":
                if (v_d === "up") {
                    for (let x = Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH); x <= Math.floor((this._ball.x + xOf) / BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "down");
                        if (y <= this._prevCoordinate.y + this._ball.r && y >= this._ball.y + this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x], dir: "right" };
                            }
                        }
                    }
                    for (let x = Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH); x <= Math.floor((this._ball.x - xOf) / BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "up");
                        if (y <= this._prevCoordinate.y - this._ball.r && y >= this._ball.y - this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1], dir: "up" };
                            }
                        }
                    }
                }
                else if (v_d === "down") {
                    for (let x = Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH); x <= Math.floor((this._ball.x - xOf) / BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "down");
                        if (y >= this._prevCoordinate.y + this._ball.r && y <= this._ball.y + this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1], dir: "down" };
                            }
                        }
                    }
                    for (let x = Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH); x <= Math.floor((this._ball.x + xOf) / BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "up");
                        if (y >= this._prevCoordinate.y - this._ball.r && y <= this._ball.y - this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x], dir: "right" };
                            }
                        }
                    }
                }
                break;
            case "left":
                if (v_d === "down") {
                    for (let x = Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH); x >= Math.floor((this._ball.x + xOf) / BLOCK_WIDTH); x--) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "down");
                        if (y >= this._prevCoordinate.y + this._ball.r && y <= this._ball.y + this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x], dir: "down" };
                            }
                        }
                    }
                    for (let x = Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH); x >= Math.floor((this._ball.x - xOf) / BLOCK_WIDTH); x--) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "up");
                        if (y >= this._prevCoordinate.y - this._ball.r && y <= this._ball.y - this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1], dir: "left" };
                            }
                        }
                    }
                }
                else if (v_d === "up") {
                    for (let x = Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH); x >= Math.floor((this._ball.x + xOf) / BLOCK_WIDTH); x--) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "up");
                        if (y <= this._prevCoordinate.y - this._ball.r && y >= this._ball.y - this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x], dir: "up" };
                            }
                        }
                    }
                    for (let x = Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH); x >= Math.floor((this._ball.x - xOf) / BLOCK_WIDTH); x--) {
                        const y = this.marginBallTrack(x * BLOCK_WIDTH, 0, "down");
                        if (y <= this._prevCoordinate.y + this._ball.r && y >= this._ball.y + this._ball.r) {
                            if (this._map.matrix[Math.floor(y / BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1]) {
                                console.log(h_d, v_d);
                                return { block: this._map.matrix[Math.floor(y / BLOCK_HEIGHT)][x - 1], dir: "left" };
                            }
                        }
                    }
                }
                break;
            default:
        }
        const [m_left, m_right, m_up, m_down] = [
            this._ball.x - this._ball.r,
            this._ball.x + this._ball.r,
            this._ball.y - this._ball.r,
            this._ball.y + this._ball.r
        ];
        if (this._map.matrix[Math.floor(m_down / BLOCK_HEIGHT)] &&
            this._map.matrix[Math.floor(m_down / BLOCK_HEIGHT)][Math.floor(this._ball.x / BLOCK_WIDTH)])
            return { block: this._map.matrix[Math.floor(m_down / BLOCK_HEIGHT)][Math.floor(this._ball.x / BLOCK_WIDTH)], dir: "down" };
        if (this._map.matrix[Math.floor(m_up / BLOCK_HEIGHT)] &&
            this._map.matrix[Math.floor(m_up / BLOCK_HEIGHT)][Math.floor(this._ball.x / BLOCK_WIDTH)])
            return { block: this._map.matrix[Math.floor(m_up / BLOCK_HEIGHT)][Math.floor(this._ball.x / BLOCK_WIDTH)], dir: "up" };
        if (this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)] &&
            this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)][Math.floor(m_left / BLOCK_WIDTH)])
            return { block: this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)][Math.floor(m_left / BLOCK_WIDTH)], dir: "left" };
        if (this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)] &&
            this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)][Math.floor(m_right / BLOCK_WIDTH)])
            return { block: this._map.matrix[Math.floor(this._ball.y / BLOCK_HEIGHT)][Math.floor(m_right / BLOCK_WIDTH)], dir: "right" };
        return false;
    }
    newJudgeBallCrash() {
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
        const crashed = this.ballCrashInfo(h_d, v_d);
        if (!crashed) {
            this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
            return false;
        }
        const point = { x: this._ball.x, y: this._ball.y };
        switch (crashed.dir) {
            case "down":
                point.y = crashed.block.y - this._ball.r;
                if (this._prevCoordinate.x !== this._ball.x) {
                    point.x = this.ballTrack(this._ball.x, point.y, true);
                }
                break;
            case "up":
                point.y = crashed.block.y + crashed.block.height + this._ball.r;
                if (this._prevCoordinate.x !== this._ball.x) {
                    point.x = this.ballTrack(this._ball.x, point.y, true);
                }
                break;
            case "right":
                point.x = crashed.block.x - this._ball.r;
                if (this._prevCoordinate.y !== this._ball.y) {
                    point.y = this.ballTrack(point.x, this._ball.y);
                }
                break;
            case "left":
                point.x = crashed.block.x + crashed.block.width + this._ball.r;
                if (this._prevCoordinate.y !== this._ball.y) {
                    point.y = this.ballTrack(point.x, this._ball.y);
                }
                break;
        }
        this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
        this._ball.crash(crashed.dir, point);
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
    ball_h_acc() {
        if (this._keyObserver.right)
            this._ball.move("right");
        if (this._keyObserver.left)
            this._ball.move("left");
        if (!this._keyObserver.right && !this._keyObserver.left)
            this._ball.h_stop();
    }
    ball_h_move() {
        this._ball.h_move();
    }
    attachCanvas(root) {
        root.appendChild(this._canvas);
    }
}
