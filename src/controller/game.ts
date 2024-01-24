import { Controller } from "./controller.js";
import { Ball } from "../ball/ball.js";
import { Map } from "../map/map.js";

import { AvailKey } from "./key.js";
import { stageBnd } from "../map/stage.js";


export class Game extends Controller {

    private _screenFrame: HTMLElement;
    private _init: HTMLElement;
    private _stageSpan: HTMLSpanElement;
    private _deadMessage: HTMLElement;
    private _clearMessage: HTMLElement;
    private _resumer: (stage: number, message: HTMLElement)=>void;
    private _resumeByKey: (e: KeyboardEvent) => void;
    private _tryAgainByKey: (e: KeyboardEvent ) => void;
    private _startByKey: (e:KeyboardEvent) => void;

    constructor() {
        super(Ball, Map)
        this._screenFrame = document.createElement("div");
        this._screenFrame.classList.add("screenFrame");

        this._stageSpan = this.renderScreenElement(
            `<span class="stage"></span>`
        )

        this._init = this.renderScreenElement(
            `
            <section class="init">
                <h3 class="title">BOUNCEBALL</h3>
                <section class="belowSection">
                    <button class="startButton">START BUTTON</button>
                    Or Press Enter
                </section>  
            </section>
            `,
            (e: HTMLElement) => {
                e.querySelector(".startButton")!.addEventListener("click", ()=>{
                    this.firstGameStart()
                    this._init.remove();
                    window.removeEventListener("keydown", this._startByKey)
                })    
            }
        )
        
        this._deadMessage = this.renderScreenElement(
            `<div class='deadMessage-container'>
                <h3 class='deadMessage'>Game Over</h3><section class='belowSection'>
                <button class='resumeButton'>Try Again?</button>Or Press Spacebar</section>
            </div>`,
            (e: HTMLElement)=>{
                e.querySelector('.resumeButton')!.addEventListener("click", ()=>{
                    this._resumer(this._stage, e)
                    window.removeEventListener("keydown", this._tryAgainByKey)
                })
            }
        )
        
        this._clearMessage = this.renderScreenElement(
            `
            <div class="clearMessage-container">
                <h3 class="clearMessage">🎉Congratulations🎉</h3>
                <section class="belowSection">
                    <button class="resumeButton">Try Again?</button>
                    Or Press Spacebar
                </section>
            </div>
            `
            , (e: HTMLElement) => {
                e.querySelector('.resumeButton')!.addEventListener("click", ()=>{
                    this._clear = false;
                    this._resumer(0, e);
                    window.removeEventListener("keydown", this._resumeByKey)
                })
            }
        )
        
        
        this._stageBackgroundRenderer = () => {
            this._stageSpan.textContent = this._stage.toString();
        }


        this._tryAgainByKey = (e:KeyboardEvent) => {
            if(e.key === " ") {
                this._resumer(this._stage, this._deadMessage);
                window.removeEventListener('keydown', this._tryAgainByKey)
            }
        }

        this._resumeByKey = (e: KeyboardEvent) => {
            if(e.key === " ") {
                this._resumer(0, this._clearMessage);
                this._clear = false;
                window.removeEventListener('keydown', this._resumeByKey)
            }
        }

        this._startByKey = (e: KeyboardEvent) => {
            if(e.key === "Enter") {
                this.firstGameStart();
                window.removeEventListener('keydown', this._startByKey)
                this._init.remove()
            }
        }

        this._gameDeadMessageRenderer = ()=>{
            this.hideElement(this._stageSpan)
            this.showElement(this._deadMessage)
            window.addEventListener('keydown', this._tryAgainByKey)
        }

        this._gameClearMessageRenderer = () => {
            this.hideElement(this._stageSpan);
            this.showElement(this._clearMessage);
            window.addEventListener('keydown', this._resumeByKey)
        }

        this._resumer = (stage: number, message: HTMLElement)=> {
            this.hideElement(message);
            this.showElement(this._stageSpan)
            this.resume(stage)
        }        

    }

    private showElement(e: HTMLElement) {
        this._screenFrame.appendChild(e);
    }

    private hideElement(e: HTMLElement) {
        e.remove()
    }

    private renderScreenElement(htmlString: string, attachEventCallback?: (e: HTMLElement)=>void) {
        const template = document.createElement('template');
        template.innerHTML = htmlString
        
        const element = template.content.firstElementChild as HTMLElement
        

        attachEventCallback && attachEventCallback(element)

        return element
    }

    private attachElementToScreen(e: HTMLElement) {
        this._screenFrame.appendChild(e);
    }

    // private renderClearMessage() {
    //     const container = document.createElement("div");
    //     container.classList.add('clearMessage-container');
    //     container.setAttribute('style', "display: none")

    //     const message = document.createElement("h3");
    //     message.classList.add('clearMessage')
    //     message.textContent = "🎉Congratulations🎉";
    //     container.appendChild(message);

    //     const belowSection = document.createElement("section")
    //     belowSection.classList.add("belowSection");

    //     const resumeButton = document.createElement("button");
    //     resumeButton.classList.add("resumeButton");
    //     resumeButton.addEventListener("click", ()=>{
    //         this._clear = false;
    //         this._resumer(0)
            
    //     });
    //     resumeButton.textContent = "Try Again?"
    //     belowSection.appendChild(resumeButton);

    //     const text = document.createTextNode(" Or Press Spacebar");
    //     belowSection.appendChild(text);
    //     container.appendChild(belowSection);
    //     this._frame.appendChild(container)

        
        
    //     return container

    // }

    // private renderDeadMessage() {

    //     const container = document.createElement("div");
    //     container.classList.add('deadMessage-container');
    //     container.setAttribute('style', "display: none")


    //     const message = document.createElement("h3");
    //     message.classList.add('deadMessage')
    //     message.textContent = "Game Over";
    //     container.appendChild(message);

    //     const belowSection = document.createElement("section")
    //     belowSection.classList.add("belowSection");

    //     const resumeButton = document.createElement("button");
    //     resumeButton.classList.add("resumeButton");
    //     resumeButton.addEventListener("click", ()=>this._resumer(this._stage));
    //     resumeButton.textContent = "Try Again?"
    //     belowSection.appendChild(resumeButton);

    //     const text = document.createTextNode(" Or Press Spacebar");
    //     belowSection.appendChild(text);
    //     container.appendChild(belowSection);
    //     this._frame.appendChild(container)

    //     return container
    // }


    // private renderInitialFrame(root: HTMLElement) {

    //     const title = document.createElement("h3");
        
    //     title.classList.add("title")
    //     title.innerText = "BounceBall".toUpperCase();
        
    //     this._init.appendChild(title)

    //     const belowSection = document.createElement("section")
    //     belowSection.classList.add("belowSection")

    //     const startButton = document.createElement("button");
    //     startButton.classList.add("startButton");
    //     startButton.innerText = "Start Button".toUpperCase();
    //     startButton.addEventListener("click",()=>{
    //         this.firstGameStart()
    //         this._init.remove();
    //     })

    //     const text = document.createTextNode("Or Press Enter");
    //     belowSection.appendChild(startButton);
    //     belowSection.appendChild(text);
    //     this._init.appendChild(belowSection)
    //     console.log('init')


    //     root.appendChild(this._screenFrame)
    // }

    private firstGameStart() {
        this._stage = 0;
        this.play()
        this.showElement(this._stageSpan)
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
        this._init.remove();

    }

    private attachScreen(root: HTMLElement) {
        root.appendChild(this._screenFrame)
    }

    init(root: HTMLElement) {
        
        this.attachCanvas(root);
        this.attachScreen(root);
        this.attachElementToScreen(this._init)
        
        window.addEventListener('keydown', this._startByKey)
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
