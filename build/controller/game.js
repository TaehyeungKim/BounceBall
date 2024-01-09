import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../constant.js";
export class Game extends Controller {
    constructor() {
        super(Ball, Map);
    }
    play(root) {
        this.attachCanvas(root);
        this.generateBlock(0, 14, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
        this.registerRenderInterval();
    }
}
