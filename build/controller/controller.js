import { Ball } from "../ball/ball.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
import { KeyboardObserver } from "./key.js";
import { stageBnd } from "../map/stage.js";
import { BounceAudio } from "../effect/sound.js";
export class Controller {
    constructor(ball, map) {
        this._animID = 0;
        this._stop = false;
        this._clear = false;
        this._keyObserver = new KeyboardObserver();
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('game');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        this._ball = new ball(10, 100, 5, 5);
        this._map = new map();
        this._stage = 0;
        this._prevCoordinate = { x: this._ball.x, y: this._ball.y };
        this._keyPressedTimeStamp = { "left": 0, "right": 0 };
    }
    findHGridOverTrack(point, dir) {
        const a = (this._prevCoordinate.y - this._ball.y) / (this._prevCoordinate.x - this._ball.x);
        if (dir === "up")
            return (point - this._prevCoordinate.y + this._ball.r * Math.sqrt(a ** 2 + 1)) / a + this._prevCoordinate.x;
        return (point - this._prevCoordinate.y - this._ball.r * Math.sqrt(a ** 2 + 1)) / a + this._prevCoordinate.x;
    }
    marginBallTrack(point, dir) {
        const a = (this._prevCoordinate.y - this._ball.y) / (this._prevCoordinate.x - this._ball.x);
        if (dir === "up")
            return this.ballTrack(point) - this._ball.r * Math.sqrt(a ** 2 + 1);
        return this.ballTrack(point) + this._ball.r * Math.sqrt(a ** 2 + 1);
    }
    ballTrack(point, reverse = false) {
        const { x: prevX, y: prevY } = this._prevCoordinate;
        const [curX, curY] = [this._ball.x, this._ball.y];
        if (reverse) {
            if (prevY === curY) {
                return curX;
            }
            else
                return ((prevX - curX) / (prevY - curY)) * (point - prevY) + prevX;
        }
        if (prevX === curX) {
            return curY;
        }
        else
            return ((prevY - curY) / (prevX - curX)) * (point - prevX) + prevY;
    }
    renderAnimation() {
        const animStep = (time) => {
            var _a;
            if (this) {
                (_a = this._canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.reset();
                this.ball_h_acc(time);
                this.ball_h_move();
                this._ball.bounce();
                this.judgeBallCrash(time);
                if (this._stop || this._clear) {
                    window.cancelAnimationFrame(this._animID);
                    this.renderBall();
                    this.renderMap(time);
                    return;
                }
                this.renderBall();
                this.renderMap(time);
            }
            this._animID = window.requestAnimationFrame(animStep);
        };
        this._animID = window.requestAnimationFrame(animStep);
    }
    judgeCrashDirection(h_d, v_d, block) {
        switch (h_d) {
            case "right":
                if (v_d === "down") {
                    return this.ballTrack(block.x) > block.y ?
                        "right" : "down";
                }
                else if (v_d === "up") {
                    return this.ballTrack(block.x) < (block.y + block.height) ?
                        "right" : "up";
                }
                return "right";
            case "left":
                if (v_d === "down") {
                    return this.ballTrack(block.x + block.width) > block.y ?
                        "left" : "down";
                }
                else if (v_d === "up") {
                    return this.ballTrack(block.x + block.width) < (block.y + block.height) ?
                        "left" : "up";
                }
                return "left";
            case "center":
                if (!(v_d === "center"))
                    return v_d;
                throw new Error("center and center can't be allowed");
        }
    }
    recursiveTrace(x, y, endX, endY, margin, xOf, h_d, v_d) {
        if (h_d === "right" && x > endX)
            return false;
        if (h_d === "left" && x < endX)
            return false;
        if (v_d === "down" && y > endY)
            return false;
        if (v_d === "up" && y < endY)
            return false;
        if (this._map.matrix[y] && this._map.matrix[y][x])
            return this._map.matrix[y] && this._map.matrix[y][x];
        let dh = 0;
        if (xOf === 1)
            dh = 1;
        if (Math.floor(this.marginBallTrack((x + dh) * BLOCK_WIDTH, margin) / BLOCK_HEIGHT) > y)
            return this.recursiveTrace(x, y + 1, endX, endY, margin, xOf, h_d, v_d);
        if (Math.floor(this.marginBallTrack((x + dh) * BLOCK_WIDTH, margin) / BLOCK_HEIGHT) < y)
            return this.recursiveTrace(x, y - 1, endX, endY, margin, xOf, h_d, v_d);
        return this.recursiveTrace(x + xOf, y, endX, endY, margin, xOf, h_d, v_d);
    }
    tempModifiedPosByDir(block, dir) {
        let x = 0;
        let y = 0;
        switch (dir) {
            case "up":
                y = (block.y + block.height) + this._ball.r;
                x = this.ballTrack(y, true);
                break;
            case "down":
                y = (block.y) - this._ball.r;
                x = this.ballTrack(y, true);
                break;
            case "left":
                x = (block.x + block.width) + this._ball.r;
                if (this._prevCoordinate.x === this._ball.x) {
                    if (this._prevCoordinate.y < this._ball.y)
                        y = block.y - this._ball.r;
                    else
                        y = block.y + block.height + this._ball.r;
                    x += 0.5;
                    console.log(x);
                }
                else
                    y = this.ballTrack(x);
                break;
            case "right":
                x = (block.x) - this._ball.r;
                if (this._prevCoordinate.x === this._ball.x) {
                    if (this._prevCoordinate.y < this._ball.y)
                        y = block.y - this._ball.r;
                    else
                        y = block.y + block.height + this._ball.r;
                    x -= 0.5;
                    console.log(x);
                }
                else
                    y = this.ballTrack(x);
                break;
        }
        return { x, y };
    }
    ballCrashInfo(h_d, v_d) {
        const a = (this._prevCoordinate.y - this._ball.y) / (this._prevCoordinate.x - this._ball.x);
        const xOf = Math.abs(a * this._ball.r / Math.sqrt(a ** 2 + 1));
        const [mg_left, mg_right, mg_up, mg_down, cX, cY] = [
            Math.floor((this._ball.x - this._ball.r) / BLOCK_WIDTH),
            Math.floor((this._ball.x + this._ball.r) / BLOCK_WIDTH),
            Math.floor((this._ball.y - this._ball.r) / BLOCK_HEIGHT),
            Math.floor((this._ball.y + this._ball.r) / BLOCK_HEIGHT),
            Math.floor(this._ball.x / BLOCK_WIDTH),
            Math.floor(this._ball.y / BLOCK_HEIGHT)
        ];
        switch (h_d) {
            case "right":
                if (v_d === "up") {
                    const up = this.recursiveTrace(Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x - xOf, "up") / BLOCK_HEIGHT), Math.floor((this._ball.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x - xOf, "up") / BLOCK_HEIGHT), "up", 1, h_d, v_d);
                    const down = this.recursiveTrace(Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x + xOf, "down") / BLOCK_HEIGHT), Math.floor((this._ball.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x + xOf, "down") / BLOCK_HEIGHT), "down", 1, h_d, v_d);
                    if (up && down) {
                        const upDir = this.judgeCrashDirection(h_d, v_d, up);
                        const downDir = this.judgeCrashDirection(h_d, v_d, down);
                        return this.tempModifiedPosByDir(up, upDir).y > this.tempModifiedPosByDir(down, downDir).y ?
                            { block: up, dir: upDir } : { block: down, dir: downDir };
                    }
                    else if (up && !down) {
                        return { block: up, dir: this.judgeCrashDirection(h_d, v_d, up) };
                    }
                    else if (!up && down) {
                        return { block: down, dir: this.judgeCrashDirection(h_d, v_d, down) };
                    }
                    const r = this._map.matrix[cY] && this._map.matrix[cY][mg_right];
                    const u = this._map.matrix[mg_up] && this._map.matrix[mg_up][cX];
                    if (r && u) {
                        if (r === u) {
                            return this.tempModifiedPosByDir(r, "right").y < this.tempModifiedPosByDir(u, "up").y ?
                                { block: r, dir: "right" } : { block: u, dir: "up" };
                        }
                        return this.tempModifiedPosByDir(r, "right").y > this.tempModifiedPosByDir(u, "up").y ?
                            { block: r, dir: "right" } : { block: u, dir: "up" };
                    }
                    else if (!r && u) {
                        return { block: u, dir: "up" };
                    }
                    else if (r && !u) {
                        return { block: r, dir: "right" };
                    }
                    return false;
                }
                else if (v_d === "down") {
                    const up = this.recursiveTrace(Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x + xOf, "up") / BLOCK_HEIGHT), Math.floor((this._ball.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x + xOf, "up") / BLOCK_HEIGHT), "up", 1, h_d, v_d);
                    const down = this.recursiveTrace(Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x - xOf, "down") / BLOCK_HEIGHT), Math.floor((this._ball.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x - xOf, "down") / BLOCK_HEIGHT), "down", 1, h_d, v_d);
                    if (up && down) {
                        const upDir = this.judgeCrashDirection(h_d, v_d, up);
                        const downDir = this.judgeCrashDirection(h_d, v_d, down);
                        return this.tempModifiedPosByDir(up, upDir).y < this.tempModifiedPosByDir(down, downDir).y ?
                            { block: up, dir: upDir } : { block: down, dir: downDir };
                    }
                    else if (up && !down) {
                        return { block: up, dir: this.judgeCrashDirection(h_d, v_d, up) };
                    }
                    else if (!up && down) {
                        return { block: down, dir: this.judgeCrashDirection(h_d, v_d, down) };
                    }
                    const r = this._map.matrix[cY] && this._map.matrix[cY][mg_right];
                    const d = this._map.matrix[mg_down] && this._map.matrix[mg_down][cX];
                    if (r && d) {
                        if (r === d) {
                            return this.tempModifiedPosByDir(r, "right").y > this.tempModifiedPosByDir(d, "down").y ?
                                { block: r, dir: "right" } : { block: d, dir: "down" };
                        }
                        return this.tempModifiedPosByDir(r, "right").y < this.tempModifiedPosByDir(d, "down").y ?
                            { block: r, dir: "right" } : { block: d, dir: "down" };
                    }
                    else if (!r && d) {
                        return { block: d, dir: "down" };
                    }
                    else if (r && !d) {
                        return { block: r, dir: "right" };
                    }
                    return false;
                }
            case "left":
                if (v_d === "down") {
                    const up = this.recursiveTrace(Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x - xOf, "up") / BLOCK_HEIGHT), Math.floor((this._ball.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x - xOf, "up") / BLOCK_HEIGHT), "up", -1, h_d, v_d);
                    const down = this.recursiveTrace(Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x + xOf, "down") / BLOCK_HEIGHT), Math.floor((this._ball.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x + xOf, "down") / BLOCK_HEIGHT), "down", -1, h_d, v_d);
                    if (up && down) {
                        const upDir = this.judgeCrashDirection(h_d, v_d, up);
                        const downDir = this.judgeCrashDirection(h_d, v_d, down);
                        return this.tempModifiedPosByDir(up, upDir).y < this.tempModifiedPosByDir(down, downDir).y ?
                            { block: up, dir: upDir } : { block: down, dir: downDir };
                    }
                    else if (up && !down) {
                        return { block: up, dir: this.judgeCrashDirection(h_d, v_d, up) };
                    }
                    else if (!up && down) {
                        return { block: down, dir: this.judgeCrashDirection(h_d, v_d, down) };
                    }
                    const l = this._map.matrix[cY] && this._map.matrix[cY][mg_left];
                    const d = this._map.matrix[mg_down] && this._map.matrix[mg_down][cX];
                    if (l && d) {
                        if (l === d) {
                            return this.tempModifiedPosByDir(l, "left").y > this.tempModifiedPosByDir(d, "down").y ?
                                { block: l, dir: "left" } : { block: d, dir: "down" };
                        }
                        return this.tempModifiedPosByDir(l, "left").y < this.tempModifiedPosByDir(d, "down").y ?
                            { block: l, dir: "left" } : { block: d, dir: "down" };
                    }
                    else if (!l && d) {
                        return { block: d, dir: "down" };
                    }
                    else if (l && !d) {
                        return { block: l, dir: "left" };
                    }
                    return false;
                }
                else if (v_d === "up") {
                    const up = this.recursiveTrace(Math.floor((this._prevCoordinate.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x + xOf, "up") / BLOCK_HEIGHT), Math.floor((this._ball.x + xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x + xOf, "up") / BLOCK_HEIGHT), "up", -1, h_d, v_d);
                    const down = this.recursiveTrace(Math.floor((this._prevCoordinate.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._prevCoordinate.x - xOf, "down") / BLOCK_HEIGHT), Math.floor((this._ball.x - xOf) / BLOCK_WIDTH), Math.floor(this.marginBallTrack(this._ball.x - xOf, "down") / BLOCK_HEIGHT), "down", -1, h_d, v_d);
                    if (up && down) {
                        const upDir = this.judgeCrashDirection(h_d, v_d, up);
                        const downDir = this.judgeCrashDirection(h_d, v_d, down);
                        return this.tempModifiedPosByDir(up, upDir).y > this.tempModifiedPosByDir(down, downDir).y ?
                            { block: up, dir: upDir } : { block: down, dir: downDir };
                    }
                    else if (up && !down) {
                        return { block: up, dir: this.judgeCrashDirection(h_d, v_d, up) };
                    }
                    else if (!up && down) {
                        return { block: down, dir: this.judgeCrashDirection(h_d, v_d, down) };
                    }
                    const l = this._map.matrix[cY] && this._map.matrix[cY][mg_left];
                    const u = this._map.matrix[mg_up] && this._map.matrix[mg_up][cX];
                    if (l && u) {
                        if (l === u) {
                            return this.tempModifiedPosByDir(l, "left").y < this.tempModifiedPosByDir(u, "up").y ?
                                { block: l, dir: "left" } : { block: u, dir: "up" };
                        }
                        return this.tempModifiedPosByDir(l, "left").y > this.tempModifiedPosByDir(u, "up").y ?
                            { block: l, dir: "left" } : { block: u, dir: "up" };
                    }
                    else if (!l && u) {
                        return { block: u, dir: "up" };
                    }
                    else if (l && !u) {
                        return { block: l, dir: "left" };
                    }
                    return false;
                }
                break;
            case "center":
                const [m_up, m_down] = [
                    this._ball.y - this._ball.r,
                    this._ball.y + this._ball.r
                ];
                const x = Math.floor(this._ball.x / BLOCK_WIDTH);
                if (v_d === "down") {
                    for (let m = Math.floor((this._prevCoordinate.y + this._ball.r) / BLOCK_HEIGHT); m <= Math.floor(m_down / BLOCK_HEIGHT); m++) {
                        if (this._map.matrix[m] && this._map.matrix[m][x]) {
                            return { block: this._map.matrix[m] && this._map.matrix[m][x],
                                dir: "down" };
                        }
                    }
                    if (this._map.matrix[cY] && this._map.matrix[cY][mg_right]) {
                        return { block: this._map.matrix[cY] && this._map.matrix[cY][mg_right],
                            dir: "right" };
                    }
                    if (this._map.matrix[cY] && this._map.matrix[cY][mg_left]) {
                        return { block: this._map.matrix[cY] && this._map.matrix[cY][mg_left],
                            dir: "left" };
                    }
                }
                else if (v_d === "up") {
                    for (let m = Math.floor((this._prevCoordinate.y - this._ball.r) / BLOCK_HEIGHT); m >= Math.floor(m_up / BLOCK_HEIGHT); m--) {
                        if (this._map.matrix[m] && this._map.matrix[m][x]) {
                            return { block: this._map.matrix[m] && this._map.matrix[m][x],
                                dir: "up" };
                        }
                    }
                    if (this._map.matrix[cY] && this._map.matrix[cY][mg_right]) {
                        return { block: this._map.matrix[cY] && this._map.matrix[cY][mg_right],
                            dir: "right" };
                    }
                    if (this._map.matrix[cY] && this._map.matrix[cY][mg_left]) {
                        return { block: this._map.matrix[cY] && this._map.matrix[cY][mg_left],
                            dir: "left" };
                    }
                }
                break;
        }
        return false;
    }
    judgeBallCrash(time) {
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
        if (crashed) {
            console.log(crashed, crashed.dir);
            if (crashed.dir === "right") {
                debugger;
            }
        }
        if (!crashed) {
            this._prevCoordinate.x = this._ball.x;
            this._prevCoordinate.y = this._ball.y;
            if (this._ball.y > CANVAS_HEIGHT)
                this.gameDead();
            return false;
        }
        let jumpOnTheWall = false;
        switch (crashed.dir) {
            case "left":
                if (this._keyObserver.right) {
                    if (time - this._keyPressedTimeStamp.left < Controller._jumpableTimeGap)
                        jumpOnTheWall = true;
                }
                break;
            case "right":
                if (this._keyObserver.left) {
                    if (time - this._keyPressedTimeStamp.right < Controller._jumpableTimeGap)
                        jumpOnTheWall = true;
                }
                break;
        }
        this.updateBallPropertyByCrash(crashed, jumpOnTheWall);
        const point = { x: this._ball.x, y: this._ball.y };
        const { x, y } = this.tempModifiedPosByDir(crashed.block, crashed.dir);
        switch (crashed.dir) {
            case "down":
                if (crashed.block.type === "FlyRight" || crashed.block.type === "FlyLeft") {
                    point.y = (2 * crashed.block.y + crashed.block.height) / 2;
                    point.x = crashed.block.type === "FlyRight" ? crashed.block.x + crashed.block.width + this._ball.r
                        : crashed.block.x - this._ball.r;
                }
                else {
                    point.y = y;
                    if (this._prevCoordinate.x !== this._ball.x)
                        point.x = x;
                }
                break;
            case "up":
                point.y = y;
                if (this._prevCoordinate.x !== this._ball.x)
                    point.x = x;
                break;
            case "right":
                point.x = x;
                if (this._prevCoordinate.y !== this._ball.y)
                    point.y = y;
                break;
            case "left":
                point.x = x;
                if (this._prevCoordinate.y !== this._ball.y)
                    point.y = y;
                break;
        }
        if (crashed.block.type === "WormholeStart")
            this.wormholeBlockTransfer(crashed);
        else
            this._ball.crash(crashed.dir, point);
        console.log(point);
        this._prevCoordinate.x = this._ball.x;
        this._prevCoordinate.y = this._ball.y;
        this.updateBlockPropertyByCrash(crashed);
    }
    bounceAudioPlay(type) {
        const audio = BounceAudio[type];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
    wormholeBlockTransfer(info) {
        const opt = info.block.opt;
        switch (info.dir) {
            case "down":
                this._ball.x = (2 * opt.x_endPoint * BLOCK_WIDTH + info.block.width) / 2;
                this._ball.y = opt.y_endPoint * BLOCK_HEIGHT + info.block.height + this._ball.r;
                break;
            case "up":
                this._ball.x = (2 * opt.x_endPoint * BLOCK_WIDTH + info.block.width) / 2;
                this._ball.y = opt.y_endPoint * BLOCK_HEIGHT - this._ball.r;
                break;
            case "right":
                this._ball.x = opt.x_endPoint * BLOCK_WIDTH + info.block.width + this._ball.r;
                this._ball.y = (2 * opt.y_endPoint * BLOCK_HEIGHT + info.block.height) / 2;
                break;
            case "left":
                this._ball.x = opt.x_endPoint * BLOCK_WIDTH - this._ball.r;
                this._ball.y = (2 * opt.y_endPoint * BLOCK_HEIGHT + info.block.height) / 2;
                ;
                break;
        }
        this._prevCoordinate.x = this._ball.x;
        this._prevCoordinate.y = this._ball.y;
    }
    ballJumpTheWall(dir) {
        this._ball.jumpOnTheWall(dir);
        this.bounceAudioPlay("JumpTheWall");
    }
    updateBallPropertyByCrash(info, jumpOnTheWall) {
        if (this._ball.flyStatus)
            this._ball.flyStatus = false;
        switch (info.block.type) {
            default:
                this.bounceAudioPlay(info.block.type);
                this._ball.updateGvsEnd(Ball.MAX_GVS);
                jumpOnTheWall && this.ballJumpTheWall(info.dir);
                break;
            case "End":
                this.bounceAudioPlay(info.block.type);
                this._ball.updateGvsEnd(Ball.MAX_GVS);
                break;
            case "Bomb":
            case "Fragile":
                if (info.dir === "down")
                    this.bounceAudioPlay(info.block.type);
                else
                    this.bounceAudioPlay("Normal");
                this._ball.updateGvsEnd(Ball.MAX_GVS);
                jumpOnTheWall && this.ballJumpTheWall(info.dir);
                break;
            case "Jump":
                if (info.dir === "down") {
                    this._ball.updateGvsEnd(1.7 * Ball.MAX_GVS);
                    this.bounceAudioPlay(info.block.type);
                }
                else
                    this.bounceAudioPlay("Normal");
                jumpOnTheWall && this.ballJumpTheWall(info.dir);
                break;
            case "FlyRight":
            case "FlyLeft":
                if (info.dir === "down") {
                    this._ball.flyStatus = info.block.type;
                    this.bounceAudioPlay(info.block.type);
                }
                break;
        }
    }
    updateBlockPropertyByCrash(info) {
        switch (info.block.type) {
            case "Fragile":
                if (info.dir === "down")
                    this._map.deleteBlock(info.block.x / BLOCK_WIDTH, info.block.y / BLOCK_HEIGHT);
                break;
            case "End":
                this._map.initializeMatrix();
                this.toNextStage();
                const clear = stageBnd[this._stage](this.generateBlock.bind(this), this.initializeBall.bind(this));
                if (clear) {
                    this._clear = true;
                    this._gameClearMessageRenderer && this._gameClearMessageRenderer();
                }
                break;
            case "Bomb":
                if (info.dir === "down")
                    this.gameDead();
                break;
        }
    }
    flattenNearBlock(h_d, v_d, crashedArray) {
        crashedArray.sort((a, b) => a.block.y - b.block.y);
        let marker = 0;
        let found = false;
        crashedArray.forEach((_, index, array) => {
            if (index < array.length - 1 && array[index].block.y === array[index + 1].block.y) {
                marker = index;
                found = true;
            }
        });
        if (found) {
            while (crashedArray.length !== marker + 2)
                crashedArray.pop();
            const latter = crashedArray.pop();
            const former = crashedArray.pop();
            let selected;
            switch (h_d) {
                case "right":
                    selected = former.block.x < latter.block.x ? former : latter;
                    crashedArray.push(selected);
                    console.log(selected);
                    break;
                case "left":
                    selected = former.block.x < latter.block.x ? latter : former;
                    crashedArray.push(selected);
                    return;
                case "center":
            }
        }
    }
    renderBall() {
        const context = this._canvas.getContext("2d");
        context.fillStyle = "yellow";
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r, 0, 0, 360);
        context.fill();
    }
    renderMap(time) {
        const context = this._canvas.getContext("2d");
        this._map.matrix.forEach(row => {
            row.forEach(e => {
                if (e) {
                    if (e.type === "End") {
                        context.fillStyle = e.renderSetting.outerColor(time);
                    }
                    else {
                        context.fillStyle = e.renderSetting.outerColor;
                    }
                    context.fillRect(e.x, e.y, e.width, e.height);
                    context.fillStyle = e.renderSetting.innerColor;
                    let [x_padding, y_padding] = [0, 0];
                    if (e.type === "WormholeStart") {
                        const p = e.renderSetting.paddingRatio;
                        x_padding = e.width * p(time);
                        y_padding = e.height * p(time);
                    }
                    else {
                        const p = e.renderSetting.paddingRatio;
                        x_padding = e.width / p;
                        y_padding = e.height / p;
                    }
                    context.fillRect(e.x + x_padding, e.y + y_padding, e.width - 2 * x_padding, e.height - 2 * y_padding);
                    switch (e.type) {
                        case "FlyRight":
                        case "FlyLeft":
                            const image = e.renderSetting.image;
                            if (image)
                                context.drawImage(image, e.x, e.y, e.width, e.height);
                            break;
                        default:
                    }
                }
            });
        });
    }
    generateBlock(x, y, type, opt) {
        this._map.pushBlock(x, y, type, opt);
    }
    ball_h_acc(time) {
        if (this._keyObserver.right) {
            this._keyPressedTimeStamp.right = time;
            this._ball.move("right");
        }
        if (this._keyObserver.left) {
            this._keyPressedTimeStamp.left = time;
            this._ball.move("left");
        }
        if (!this._keyObserver.right && !this._keyObserver.left)
            this._ball.h_stop();
    }
    ball_h_move() {
        if (this._ball.flyStatus)
            this._ball.fly(this._ball.flyStatus);
        this._ball.h_move();
        if ((this._keyObserver.left && this._ball.flyStatus === "FlyRight")
            || (this._keyObserver.right && this._ball.flyStatus === "FlyLeft")) {
            this._ball.flyStatus = false;
            this.bounceAudioPlay("Drift");
        }
    }
    initializeBall(coord) {
        this._prevCoordinate.x = coord.x;
        this._prevCoordinate.y = coord.y;
        this._ball.initializeBall(coord);
    }
    toNextStage() {
        this._stage += 1;
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
    }
    toPrevStage() {
        this._stage -= 1;
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
    }
    gameDead() {
        this._stop = true;
        this._gameDeadMessageRenderer && this._gameDeadMessageRenderer();
    }
    attachCanvas(root) {
        root.appendChild(this._canvas);
    }
}
Controller._jumpableTimeGap = 150;
