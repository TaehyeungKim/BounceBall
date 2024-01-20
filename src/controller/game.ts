import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";

import { AvailKey } from "./key.js";
import { stageBnd } from "../map/stage.js";


export class Game extends Controller {

    private _thumbnailFrame: HTMLElement;
    private _initFrame: HTMLElement;
    private _stageSpan: HTMLSpanElement;
    private _deadMessageContainer: HTMLElement;
    private _clearMessageContainer: HTMLElement;
    private _resumer: (stage: number)=>void;
    private _resumeByKey: (e: KeyboardEvent) => void;
    private _tryAgainByKey: (e: KeyboardEvent ) => void;
    constructor() {
        super(Ball, Map)
        this._thumbnailFrame = document.createElement("div");
        this._thumbnailFrame.classList.add("thumbnailFrame");

        this._initFrame = document.createElement("section");
        this._initFrame.classList.add("thumbnail");
        this._thumbnailFrame.appendChild(this._initFrame)

        this._stageSpan = document.createElement("span");
        this._stageSpan.classList.add("stage")
        this._stageSpan.setAttribute('style', "display: none");
        this._thumbnailFrame.appendChild(this._stageSpan)

        this._deadMessageContainer = this.renderDeadMessage();      
        this._clearMessageContainer = this.renderClearMessage();  
        
        this._stageBackgroundRenderer = () => {
            this._stageSpan.textContent = this._stage.toString();
        }

        this._tryAgainByKey = (e:KeyboardEvent) => {
            if(e.key === " ") {
                this._resumer(this._stage);
                window.removeEventListener('keydown', this._tryAgainByKey)
            }
        }

        this._resumeByKey = (e: KeyboardEvent) => {
            if(e.key === " ") {
                this._resumer(0);
                this._clear = false;
                window.removeEventListener('keydown', this._resumeByKey)
            }
        }

        this._gameDeadMessageRenderer = ()=>{
            this.hideElement(this._stageSpan)
            this.showElement(this._deadMessageContainer)
            window.addEventListener('keydown', this._tryAgainByKey)
        }

        this._gameClearMessageRenderer = () => {
            this.hideElement(this._stageSpan);
            this.showElement(this._clearMessageContainer);
            window.addEventListener('keydown', this._resumeByKey)
        }

        this._resumer = (stage: number)=> {
            this.hideElement(this._deadMessageContainer);
            this.hideElement(this._clearMessageContainer);
            this.showElement(this._stageSpan)
            this.resume(stage)
        }        

    }

    private showElement(e: HTMLElement) {
        e.removeAttribute('style')
        
    }

    private hideElement(e: HTMLElement) {
        e.setAttribute('style', "display: none")
    }

    private renderClearMessage() {
        const container = document.createElement("div");
        container.classList.add('clearMessage-container');
        container.setAttribute('style', "display: none")

        const message = document.createElement("h3");
        message.classList.add('clearMessage')
        message.textContent = "🎉Congratulations🎉";
        container.appendChild(message);

        const belowSection = document.createElement("section")
        belowSection.classList.add("belowSection");

        const resumeButton = document.createElement("button");
        resumeButton.classList.add("resumeButton");
        resumeButton.addEventListener("click", ()=>{
            this._clear = false;
            this._resumer(0)
            
        });
        resumeButton.textContent = "Try Again?"
        belowSection.appendChild(resumeButton);

        const text = document.createTextNode(" Or Press Spacebar");
        belowSection.appendChild(text);
        container.appendChild(belowSection);
        this._thumbnailFrame.appendChild(container)

        
        
        return container

    }

    private renderDeadMessage() {

        const container = document.createElement("div");
        container.classList.add('deadMessage-container');
        container.setAttribute('style', "display: none")


        const message = document.createElement("h3");
        message.classList.add('deadMessage')
        message.textContent = "Game Over";
        container.appendChild(message);

        const belowSection = document.createElement("section")
        belowSection.classList.add("belowSection");

        const resumeButton = document.createElement("button");
        resumeButton.classList.add("resumeButton");
        resumeButton.addEventListener("click", ()=>this._resumer(this._stage));
        resumeButton.textContent = "Try Again?"
        belowSection.appendChild(resumeButton);

        const text = document.createTextNode(" Or Press Spacebar");
        belowSection.appendChild(text);
        container.appendChild(belowSection);
        this._thumbnailFrame.appendChild(container)

        
        
        return container
    }


    private renderInitialFrame(root: HTMLElement) {

        const title = document.createElement("h3");
        
        title.classList.add("title")
        title.innerText = "BounceBall".toUpperCase();
        
        this._initFrame.appendChild(title)

        const belowSection = document.createElement("section")
        belowSection.classList.add("belowSection")

        const startButton = document.createElement("button");
        startButton.classList.add("startButton");
        startButton.innerText = "Start Button".toUpperCase();
        startButton.addEventListener("click",()=>{
            this.firstGameStart()
            this._initFrame.remove();
        })

        const text = document.createTextNode("Or Press Enter");
        belowSection.appendChild(startButton);
        belowSection.appendChild(text);
        this._initFrame.appendChild(belowSection)


        root.appendChild(this._thumbnailFrame)
    }

    private firstGameStart() {
        this._stage = 0;
        this.play()
        this.showElement(this._stageSpan)
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
        this._initFrame.remove();

    }

    init(root: HTMLElement) {
        
        this.attachCanvas(root);
        this.renderInitialFrame(root);
        
        const startGame = (e: KeyboardEvent) => {
            if(e.key === "Enter") this.firstGameStart()
            window.removeEventListener('keydown', startGame)
        }
        window.addEventListener('keydown', startGame)
    }

    play() {
        
        stageBnd[this._stage](this.generateBlock.bind(this), this.initializeBall.bind(this))

        this.renderAnimation();

        window.addEventListener('keydown', (e:KeyboardEvent)=>{
            if(e.key === "ArrowLeft"||"ArrowRight"||"ArrowUp"||"ArorwDown") {
                const key = e.key as AvailKey
                this._keyObserver.keyToggle(key,true)
            }
        })
        window.addEventListener('keyup', (e:KeyboardEvent)=>{
            if(e.key === "ArrowLeft"||"ArrowRight"||"ArrowUp"||"ArorwDown") {
                const key = e.key as AvailKey
                this._keyObserver.keyToggle(key,false)
            }
        }) 
            
    }

    resume(stage: number) {
        this._stop = false;
        this._stage = stage;
        this.play();
        this._stageBackgroundRenderer && this._stageBackgroundRenderer()
    }
}
