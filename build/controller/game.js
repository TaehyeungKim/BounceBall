import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";
import { stageBnd } from "../map/stage.js";
export class Game extends Controller {
    constructor() {
        super(Ball, Map);
        this._screenFrame = document.createElement("div");
        this._screenFrame.classList.add("screenFrame");
        this._stageSpan = this.renderScreenElement(`<span class="stage"></span>`);
        this._init = this.renderScreenElement(`
            <section class="init">
                <h3 class="title">BOUNCEBALL</h3>
                <section class="belowSection">
                    <button class="startButton">START BUTTON</button>
                    Or Press Enter
                </section>  
            </section>
            `, (e) => {
            e.querySelector(".startButton").addEventListener("click", () => {
                this.firstGameStart();
                this._init.remove();
                window.removeEventListener("keydown", this._startByKey);
            });
        });
        this._deadMessage = this.renderScreenElement(`<div class='deadMessage-container'>
                <h3 class='deadMessage'>Game Over</h3><section class='belowSection'>
                <button class='resumeButton'>Try Again?</button>Or Press Spacebar</section>
            </div>`, (e) => {
            e.querySelector('.resumeButton').addEventListener("click", () => {
                this._resumer(this._stage, e);
                window.removeEventListener("keydown", this._tryAgainByKey);
            });
        });
        this._clearMessage = this.renderScreenElement(`
            <div class="clearMessage-container">
                <h3 class="clearMessage">🎉Congratulations🎉</h3>
                <section class="belowSection">
                    <button class="resumeButton">Try Again?</button>
                    Or Press Spacebar
                </section>
            </div>
            `, (e) => {
            e.querySelector('.resumeButton').addEventListener("click", () => {
                this._clear = false;
                this._resumer(0, e);
                window.removeEventListener("keydown", this._resumeByKey);
            });
        });
        this._stageBackgroundRenderer = () => {
            this._stageSpan.textContent = this._stage.toString();
        };
        this._tryAgainByKey = (e) => {
            if (e.key === " ") {
                this._resumer(this._stage, this._deadMessage);
                window.removeEventListener('keydown', this._tryAgainByKey);
            }
        };
        this._resumeByKey = (e) => {
            if (e.key === " ") {
                this._resumer(0, this._clearMessage);
                this._clear = false;
                window.removeEventListener('keydown', this._resumeByKey);
            }
        };
        this._startByKey = (e) => {
            if (e.key === "Enter") {
                this.firstGameStart();
                window.removeEventListener('keydown', this._startByKey);
                this._init.remove();
            }
        };
        this._gameDeadMessageRenderer = () => {
            this.hideElement(this._stageSpan);
            this.showElement(this._deadMessage);
            window.addEventListener('keydown', this._tryAgainByKey);
        };
        this._gameClearMessageRenderer = () => {
            this.hideElement(this._stageSpan);
            this.showElement(this._clearMessage);
            window.addEventListener('keydown', this._resumeByKey);
        };
        this._resumer = (stage, message) => {
            this.hideElement(message);
            this.showElement(this._stageSpan);
            this.resume(stage);
        };
    }
    showElement(e) {
        this._screenFrame.appendChild(e);
    }
    hideElement(e) {
        e.remove();
    }
    renderScreenElement(htmlString, attachEventCallback) {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        const element = template.content.firstElementChild;
        attachEventCallback && attachEventCallback(element);
        return element;
    }
    attachElementToScreen(e) {
        this._screenFrame.appendChild(e);
    }
    firstGameStart() {
        this._stage = 3;
        this.play();
        this.showElement(this._stageSpan);
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
        this._init.remove();
    }
    attachScreen(root) {
        root.appendChild(this._screenFrame);
    }
    init(root) {
        this.attachCanvas(root);
        this.attachScreen(root);
        this.attachElementToScreen(this._init);
        window.addEventListener('keydown', this._startByKey);
    }
    play() {
        stageBnd[this._stage](this.generateBlock.bind(this), this.initializeBall.bind(this));
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
    resume(stage) {
        this._stop = false;
        this._stage = stage;
        this.play();
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
    }
}
