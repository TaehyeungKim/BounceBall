import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { stageBnd } from "../map/stage.js";
export class Game extends Controller {
    constructor() {
        super(Ball, Map);
        this._stage = 0;
    }
    play(root) {
        this.attachCanvas(root);
        stageBnd[`stage_${this._stage}`](this.generateBlock.bind(this), this.initializeBall.bind(this));
        this.renderAnimation();
        window.addEventListener('keydown', (e) => {
            if (e.key === "ArrowLeft" || "ArrowRight" || "ArrowUp" || "ArorwDown") {
                const key = e.key;
                this._keyObserver.keyToggle(key, true);
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === "ArrowLeft" || "ArrowRight" || "ArrowUp" || "ArorwDown") {
                const key = e.key;
                this._keyObserver.keyToggle(key, false);
            }
        });
    }
    toNextStage() {
        this._stage += 1;
    }
    toPrevStage() {
        this._stage -= 1;
    }
}
