import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
export class Game extends Controller {
    constructor() {
        super(Ball);
    }
    play(root) {
        this.attachCanvas(root);
        this.registerRenderInterval();
    }
}
