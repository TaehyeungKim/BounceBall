import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
export class Game extends Controller {
    constructor() {
        super(Ball, Map);
    }
    play(root) {
        this.attachCanvas(root);
        for (let i = 0; i < (CANVAS_WIDTH / BLOCK_WIDTH); i++) {
            for (let j = i; j < (CANVAS_HEIGHT / BLOCK_HEIGHT); j++) {
                this.generateBlock(j, 14 - j, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            }
        }
        this.registerRenderInterval();
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
}
