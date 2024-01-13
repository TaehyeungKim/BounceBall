import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH, CANVAS_WIDTH } from "../constant.js";
export class Game extends Controller {
    constructor() {
        super(Ball, Map);
    }
    play(root) {
        this.attachCanvas(root);
        for (let i = 0; i < (CANVAS_WIDTH / BLOCK_WIDTH); i++) {
            if (i === 10)
                this.generateBlock(i, 11, BLOCK_WIDTH, BLOCK_HEIGHT, 'Jump');
            else if (i === 30)
                this.generateBlock(i, 11, BLOCK_WIDTH, BLOCK_HEIGHT, 'Fragile');
            else
                this.generateBlock(i, 11, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
        }
        this.generateBlock(13, 9, BLOCK_WIDTH, BLOCK_HEIGHT, "WormholeStart", {
            start: true,
            x_endPoint: 13,
            y_endPoint: 22
        });
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
}
