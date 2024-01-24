import { Ball, Coordinate, BallDirection } from "../ball/ball.js";
import { BlockType, Block, BlockAdditionalSetting, ColorFuncByTimeStamp, PaddingFuncByTimeStamp } from "../block/baseBl.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT} from "../constant.js";
import { Map } from "../map/map.js";
import { KeyboardObserver } from "./key.js";
import { stageBnd } from "../map/stage.js";
import { BounceAudio } from "../effect/sound.js";

export type SpecialBallMove = "JumpTheWall"|"FlyRight"|"FlyLeft"|"Drift"

type BallConstructor = {
    new(x:number, y:number, width:number, height: number): Ball;
}

type MapConstructor = {
    new(): Map
}

type CrashInfo = {
    block: Block<BlockType>,
    dir: BallDirection
}

type H_D = 'left'|'right'|'center'
type V_D = 'up'|'down'|'center'
// export interface BlockGenerator<T extends BlockType> {
//     x:number, 
//     y:number, 
//     w:number, 
//     h:number, 
//     type: BlockType, 
//     opt?: BlockAdditionalSetting<T>
// }



export class Controller {


    static _jumpableTimeGap: number = 150

    private _ball: Ball
    private _canvas: HTMLCanvasElement;
    
    private _map: Map;
    private _prevCoordinate: Coordinate

    private _animID: number = 0;
    protected _stop: boolean = false;
    protected _clear: boolean = false;

    protected _stage: number

    protected _keyObserver: KeyboardObserver = new KeyboardObserver();
    protected _stageBackgroundRenderer: (()=>void)|undefined
    protected _gameDeadMessageRenderer:(()=>void)|undefined
    protected _gameClearMessageRenderer:(()=>void)|undefined
    private _keyPressedTimeStamp: {[k in Extract<BallDirection, "left"|"right">]: DOMHighResTimeStamp}


    constructor(ball: BallConstructor, map: MapConstructor) {
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('game');
        this._canvas.width = CANVAS_WIDTH;
        this._canvas.height = CANVAS_HEIGHT;
        
        this._ball = new ball(10,100,5,5);
        this._map = new map()
        this._stage = 0;

        this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
        this._keyPressedTimeStamp = {"left": 0, "right": 0}
        
    }

    private marginBallTrack(x:number, y:number, dir: "up"|"down") {
        const a = (this._prevCoordinate.y - this._ball.y)/(this._prevCoordinate.x - this._ball.x)

        if(dir === "up") return this.ballTrack(x,y) - this._ball.r*Math.sqrt(a**2 + 1)
        return this.ballTrack(x,y) + this._ball.r*Math.sqrt(a**2 + 1)
    }

    private ballTrack(x:number, y:number, reverse:boolean=false) {
        const {x: prevX, y: prevY} = this._prevCoordinate
        const [curX, curY] = [this._ball.x, this._ball.y]
        if(reverse) {
            if(prevY === curY) {return x}
            else return ((prevX - curX)/(prevY - curY))*(y-prevY) + prevX
        }
        if(prevX === curX) {return y}
        else return ((prevY - curY)/(prevX - curX))*(x-prevX) + prevY
    }

    renderAnimation() {
        
        const animStep = (time: DOMHighResTimeStamp) => {
            
            if(this) {
                this._canvas.getContext("2d")?.reset()
                this.ball_h_acc(time);
                this.ball_h_move()
                this._ball.bounce()
                
                this.judgeBallCrash(time);
                if(this._stop || this._clear) {
                    window.cancelAnimationFrame(this._animID)
                    this.renderBall();
                    this.renderMap(time);
                    return ;
                }
                this.renderBall();
                this.renderMap(time);
            
            }
            this._animID = window.requestAnimationFrame(animStep)
        }
        this._animID = window.requestAnimationFrame(animStep)
    }

    private checkAndConfirm(grid: Block<BlockType>|null|undefined, array: CrashInfo[], dir: BallDirection) {
        
        if(grid) {
            const tempBlockArray = array.map(c=>c.block);
            console.log(tempBlockArray.includes(grid), grid, dir)
            if(!tempBlockArray.includes(grid)) array.push({block: grid, dir })
            
        }
    }

    private checkBallOverTheMargin(c: number, checking: BallDirection) {
        switch(checking) {
            case "up":
                return !(Math.floor(c/BLOCK_HEIGHT) === Math.floor((c - 2*this._ball.r)/BLOCK_HEIGHT))
            case "down":
                return !(Math.floor(c/BLOCK_HEIGHT) === Math.floor((c+2*this._ball.r)/BLOCK_HEIGHT))
            case "left":
                return !(Math.floor(c/BLOCK_WIDTH) === Math.floor((c - 2*this._ball.r)/BLOCK_WIDTH))
            case "right":
                return !(Math.floor(c/BLOCK_WIDTH) === Math.floor((c+2*this._ball.r)/BLOCK_WIDTH))
        }
    }
    

    private ballCrashInfo(h_d: H_D, v_d: V_D):CrashInfo[]|false {

        const crashArray: CrashInfo[] = [];

        //if the ball penetrates the edge of the block
        const a = (this._prevCoordinate.y - this._ball.y)/(this._prevCoordinate.x - this._ball.x);

        const xOf = a*this._ball.r / Math.sqrt(a**2 + 1)

        const [m_left, m_right, m_up, m_down] = [
            this._ball.x - this._ball.r,
            this._ball.x + this._ball.r,
            this._ball.y - this._ball.r,
            this._ball.y + this._ball.r
        ]

        switch(h_d) {
            case "right":
                if(v_d === "up") {
                    for(let x = Math.floor((this._prevCoordinate.x + xOf)/BLOCK_WIDTH)+1; 
                    x <= Math.floor((this._ball.x + xOf)/BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "down")
                        // y <= this._prevCoordinate.y + this._ball.r && y >= this._ball.y + this._ball.r
                        //     &&
                        if( this.checkBallOverTheMargin(y, "up")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x],
                                    crashArray,
                                    "right"
                                )
                            }
                    }
                    this.checkAndConfirm(
                        this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_right/BLOCK_WIDTH)],
                        crashArray,
                        "right"
                    )
                    for(let x = Math.floor((this._prevCoordinate.x - xOf)/BLOCK_WIDTH)+1;
                    x <= Math.floor((this._ball.x - xOf)/BLOCK_WIDTH); x++) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "up");
                        // y <= this._prevCoordinate.y - this._ball.r && y >= this._ball.y - this._ball.r
                        //     && 
                        if(this.checkBallOverTheMargin(y, "down")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1],
                                    crashArray,
                                    "up"
                                )
                                
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1])
                            }
                            
                    }
                    this.checkAndConfirm(
                    this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)]&&this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] ,
                    crashArray,
                    "up"
                    )
                }
                else if(v_d === "down") {
                    const endPoint = this.checkBallOverTheMargin(this._ball.x + this._ball.r, "left") ?
                    Math.floor((this._ball.x - xOf)/BLOCK_WIDTH) + 1 : Math.floor((this._ball.x - xOf)/BLOCK_WIDTH)
                    for(let x = Math.floor((this._prevCoordinate.x - xOf)/BLOCK_WIDTH) + 1;
                    x <= endPoint; x++) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "down");
                        // y >= this._prevCoordinate.y + this._ball.r && y <= this._ball.y + this._ball.r
                        //     &&
                        // console.log("right down")
                        if(this.checkBallOverTheMargin(y, "up")) {
                            this.checkAndConfirm(
                                this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1],
                                crashArray,
                                "down"
                            )        
                            // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1])
                        }
                            
                    }
                    this.checkAndConfirm(
                        this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)],
                        crashArray,
                        "down"
                    )

                    for(let x =  Math.floor((this._prevCoordinate.x + xOf)/BLOCK_WIDTH)+1;
                    x <= endPoint; x++) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "up");
                        // y >= this._prevCoordinate.y - this._ball.r && y <= this._ball.y - this._ball.r
                        //     &&
                        
                        if( this.checkBallOverTheMargin(y, "down")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x],
                                    crashArray,
                                    "right")  
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x])
                            }
                            
                    }
                    this.checkAndConfirm(
                        this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_right/BLOCK_WIDTH)],
                        crashArray,
                        "right"
                    )
                }
                break;
            case "left":
                if(v_d === "down") {
                    
                    for(let x = Math.floor((this._prevCoordinate.x + xOf)/BLOCK_WIDTH); 
                    x >= Math.floor((this._ball.x + xOf)/BLOCK_WIDTH)+1; x--) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "down");
                        // y >= this._prevCoordinate.y + this._ball.r && y <= this._ball.y + this._ball.r
                        //     &&
                        if( this.checkBallOverTheMargin(y, "up")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x],
                                    crashArray,
                                    "down")                        
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x])
                            }
                    }
                    this.checkAndConfirm(
                        this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)],
                        crashArray,
                        "down"
                    )
                    for(let x = Math.floor((this._prevCoordinate.x - xOf)/BLOCK_WIDTH); 
                    x >= Math.floor((this._ball.x - xOf)/BLOCK_WIDTH)+1; x--) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "up");
                        // y >= this._prevCoordinate.y - this._ball.r && y<=this._ball.y - this._ball.r
                        //     &&
                        if( this.checkBallOverTheMargin(y, "down")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1],
                                    crashArray,
                                    "left"
                                );
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1])
                            }
                            
                    }
                    this.checkAndConfirm(
                    this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)]&& this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_left/BLOCK_WIDTH)],
                    crashArray,
                    "left"
                    )
                }
                else if(v_d === "up") {
                    for(let x = Math.floor((this._prevCoordinate.x + xOf)/BLOCK_WIDTH); 
                    x >= Math.floor((this._ball.x + xOf)/BLOCK_WIDTH)+1; x--) {
                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "up");
                        // y <= this._prevCoordinate.y - this._ball.r && y >= this._ball.y - this._ball.r
                        //     &&
                        if( this.checkBallOverTheMargin(y, "down")) {
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x],
                                    crashArray,
                                    "up"
                                )
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x])
                            }
                            
                    }
                    this.checkAndConfirm(
                        this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)]&&this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] ,
                        crashArray,
                        "up"
                    )
                    for(let x = Math.floor((this._prevCoordinate.x - xOf)/BLOCK_WIDTH); 
                    x >= Math.floor((this._ball.x - xOf)/BLOCK_WIDTH)+1; x--) {

                        const y = this.marginBallTrack(x*BLOCK_WIDTH, 0, "down");
                        // y <= this._prevCoordinate.y + this._ball.r && y >= this._ball.y + this._ball.r
                        //     &&
                        if( this.checkBallOverTheMargin(y, "up")){
                                this.checkAndConfirm(
                                    this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1],
                                    crashArray,
                                    "left"
                                )
                                // console.log('border', this._map.matrix[Math.floor(y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(y/BLOCK_HEIGHT)][x-1])
                            } 
                    }
                    this.checkAndConfirm(
                    this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)]&& this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_left/BLOCK_WIDTH)],
                    crashArray,
                    "left"
                    )
                }
                break;
            case "center":
                if(v_d === "down") 
                this.checkAndConfirm(
                        this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)],
                        crashArray,
                        "down"
                    )
                else if(v_d === "up")
                this.checkAndConfirm(
                    this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)]&&this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] ,
                    crashArray,
                    "up"
                )
                break;

        }

        
        //finishing judging if the ball penetrates the block

        //general crash case from this on

        // const [m_left, m_right, m_up, m_down] = [
        //     this._ball.x - this._ball.r,
        //     this._ball.x + this._ball.r,
        //     this._ball.y - this._ball.r,
        //     this._ball.y + this._ball.r
        // ]

        //down        
        // this.checkAndConfirm(
        //     this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(m_down/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)],
        //     crashArray,
        //     "down"
        // )

        //up
        // this.checkAndConfirm(
        //     this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)]&&this._map.matrix[Math.floor(m_up/BLOCK_HEIGHT)][Math.floor(this._ball.x/BLOCK_WIDTH)] ,
        //     crashArray,
        //     "up"
        // )

        // //left
        // this.checkAndConfirm(
        //     this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)]&& this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_left/BLOCK_WIDTH)],
        //     crashArray,
        //     "left"
        // )

        // //right
        // this.checkAndConfirm(
        //     this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)] && this._map.matrix[Math.floor(this._ball.y/BLOCK_HEIGHT)][Math.floor(m_right/BLOCK_WIDTH)],
        //     crashArray,
        //     "right"
        // )

        if(crashArray.length !== 0) {
            this.flattenNearBlock(h_d, v_d, crashArray)
            return crashArray
        }
        
        
        return false
    }

    judgeBallCrash(time: DOMHighResTimeStamp) {
        let h_d: 'left'|'right'|'center'; let v_d: 'up'|'down'|'center'

        if(this._ball.x > this._prevCoordinate.x) h_d = 'right';
        else if(this._ball.x === this._prevCoordinate.x) h_d = 'center';
        else h_d = 'left';

        if(this._ball.y > this._prevCoordinate.y) v_d = 'down';
        else if(this._ball.y === this._prevCoordinate.y) v_d = 'center';
        else v_d = 'up'

        const crashed = this.ballCrashInfo(h_d, v_d);
        if(!crashed) {
            this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
            if(this._ball.y > CANVAS_HEIGHT) this.gameDead();
            return false
        }
        
        crashed.forEach(c=>{
            let jumpOnTheWall = false;
            switch(c.dir) {
                case "left":
                    if(this._keyObserver.right) {
                        
                        if(time - this._keyPressedTimeStamp.left < Controller._jumpableTimeGap) jumpOnTheWall = true;
                    }
                    break;
                case "right":
                    if(this._keyObserver.left) {
                        
                        if(time - this._keyPressedTimeStamp.right < Controller._jumpableTimeGap) jumpOnTheWall = true;
                    }
                    break;
                    
            }
            this.updateBallPropertyByCrash(c, jumpOnTheWall)
        })
        
        
        const point:Coordinate = {x: this._ball.x, y: this._ball.y}
        
        crashed.forEach(crashed=>{
            
            switch(crashed.dir) {
                case "down":
                    if(crashed.block.type === "FlyRight" || crashed.block.type ==="FlyLeft") {
                        point.y = (2*crashed.block.y + crashed.block.height)/2
                        point.x = crashed.block.type === "FlyRight" ? crashed.block.x + crashed.block.width + this._ball.r
                        : crashed.block.x - this._ball.r
                    
                    }
                    else point.y = crashed.block.y - this._ball.r
                    
                
                    // if(this._prevCoordinate.x !== this._ball.x) {
                    //     point.x = this.ballTrack(this._ball.x, point.y, true)    
                    // }
                    break;
                case "up":
                    point.y = crashed.block.y + crashed.block.height + this._ball.r;
                    // if(this._prevCoordinate.x !== this._ball.x) {
                    //     point.x = this.ballTrack(this._ball.x, point.y, true)
                    // }
                    break;
                case "right":
                    point.x = crashed.block.x - this._ball.r;
                    // if(this._prevCoordinate.y !== this._ball.y) {
                    //     point.y = this.ballTrack(point.x, this._ball.y);
                    // }
                    
                    break;
                case "left":
                    point.x = crashed.block.x + crashed.block.width +this._ball.r;
                    // if(this._prevCoordinate.y !== this._ball.y) {
                    //     point.y = this.ballTrack(point.x, this._ball.y)
                    // }
                    
                    break;
            }
            
            if(crashed.block.type === "WormholeStart") this.wormholeBlockTransfer(crashed);
            else this._ball.crash(crashed.dir, point)
            
            this._prevCoordinate = {x: this._ball.x, y: this._ball.y}
            
            this.updateBlockPropertyByCrash(crashed)


        })  
          
    }

    private bounceAudioPlay(type: BlockType|SpecialBallMove) {
        const audio = BounceAudio[type]
        if(audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    private wormholeBlockTransfer(info: CrashInfo) {
        const opt = info.block.opt as BlockAdditionalSetting<"WormholeStart">
        
        switch(info.dir) {
            case "down":
                this._ball.x = (2*opt.x_endPoint*BLOCK_WIDTH + info.block.width)/2;
                this._ball.y = opt.y_endPoint*BLOCK_HEIGHT + info.block.height + this._ball.r
                break;
            case "up":
                this._ball.x = (2*opt.x_endPoint*BLOCK_WIDTH + info.block.width)/2;
                this._ball.y = opt.y_endPoint*BLOCK_HEIGHT - this._ball.r
                break;
            case "right":
                this._ball.x = opt.x_endPoint*BLOCK_WIDTH + info.block.width + this._ball.r;
                this._ball.y = (2*opt.y_endPoint*BLOCK_HEIGHT + info.block.height)/2;
                
                break;
            case "left":
                this._ball.x = opt.x_endPoint*BLOCK_WIDTH - this._ball.r;
                this._ball.y = (2*opt.y_endPoint*BLOCK_HEIGHT + info.block.height)/2;;
                break;
        }
        this._prevCoordinate.x = this._ball.x; this._prevCoordinate.y = this._ball.y
    }

    private ballJumpTheWall(dir: BallDirection) {
        this._ball.jumpOnTheWall(dir)
        this.bounceAudioPlay("JumpTheWall")
    }

    private updateBallPropertyByCrash(info: CrashInfo, jumpOnTheWall:boolean) {
        
        if(this._ball.flyStatus) this._ball.flyStatus = false;
        
        switch(info.block.type) {
            default:
                this.bounceAudioPlay(info.block.type)
                this._ball.updateGvsEnd(Ball.MAX_GVS)

                jumpOnTheWall && this.ballJumpTheWall(info.dir)
                
                break;
            case "End":
                this.bounceAudioPlay(info.block.type)
                this._ball.updateGvsEnd(Ball.MAX_GVS)
                break;
            case "Bomb":
            case "Fragile":
                if(info.dir === "down") this.bounceAudioPlay(info.block.type);
                else this.bounceAudioPlay("Normal");
                this._ball.updateGvsEnd(Ball.MAX_GVS)
                
                jumpOnTheWall && this.ballJumpTheWall(info.dir)
                break;
            case "Jump":
                if(info.dir === "down") {
                    this._ball.updateGvsEnd(1.7*Ball.MAX_GVS)
                    this.bounceAudioPlay(info.block.type);
                }
                else this.bounceAudioPlay("Normal")
                
                jumpOnTheWall && this.ballJumpTheWall(info.dir)
                break;
            case "FlyRight":
            case "FlyLeft":
                
                if(info.dir === "down") {
                    this._ball.flyStatus = info.block.type
                    this.bounceAudioPlay(info.block.type)
                }
                break;
    
            
            
        }
    }

    private updateBlockPropertyByCrash(info: CrashInfo) {
        switch(info.block.type) {

            case "Fragile":
                if(info.dir === "down") this._map.deleteBlock(info.block.x/BLOCK_WIDTH, info.block.y/BLOCK_HEIGHT)
                break;
            case "End":
                this._map.initializeMatrix();
                this.toNextStage();
                const clear = stageBnd[this._stage](this.generateBlock.bind(this), this.initializeBall.bind(this))
                if(clear) {
                    this._clear = true;
                    this._gameClearMessageRenderer && this._gameClearMessageRenderer();
                }
                break;
            case "Bomb":
                if(info.dir === "down") this.gameDead();
                break;

        }
    }

    private flattenNearBlock(h_d: H_D, v_d: V_D, crashedArray: CrashInfo[]) {
        crashedArray.sort((a,b)=>a.block.y - b.block.y)
        let marker = 0;
        let found = false;
        crashedArray.forEach((_, index, array)=>{
            if(index < array.length - 1 && array[index].block.y === array[index+1].block.y) {
                marker = index;
                found = true;
            }
        })
        if(found) {
            while(crashedArray.length !== marker+2) crashedArray.pop()
            const latter = crashedArray.pop() as CrashInfo;
            const former = crashedArray.pop() as CrashInfo;
            
            let selected

            switch(h_d) {
                case "right":
                    selected = former.block.x < latter.block.x ? former : latter 
                    crashedArray.push(selected);
                    console.log(selected)
                    break;
                case "left":
                    selected = former.block.x < latter.block.x ? latter : former
                    crashedArray.push(selected)
                    return 
                case "center":

            }
        }
    }

    renderBall() {
        const context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        context.fillStyle = "yellow"
        context.ellipse(this._ball.x, this._ball.y, this._ball.r, this._ball.r,0,0,360)
        context.fill()
    }

    renderMap(time: DOMHighResTimeStamp) {
        const context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        this._map.matrix.forEach(row=>{
            row.forEach(e=>{
                if(e) {
                    if(e.type === "End") {    
                        context.fillStyle = (e.renderSetting.outerColor as ColorFuncByTimeStamp)(time)
                    }
                    else {
                        context.fillStyle = e.renderSetting.outerColor as string
                    }    
                    context.fillRect(e.x, e.y, e.width, e.height);

                    context.fillStyle = e.renderSetting.innerColor as string;
                    let [x_padding, y_padding] = [0,0]
                    if(e.type === "WormholeStart") {
                        const p = e.renderSetting.paddingRatio as PaddingFuncByTimeStamp
                        x_padding = e.width*p(time); y_padding = e.height*p(time)
                    } else {
                        const p = e.renderSetting.paddingRatio as number;
                        x_padding = e.width/p; y_padding = e.height/p
                    }
                    
                    context.fillRect(e.x + x_padding, e.y + y_padding, e.width - 2*x_padding, e.height - 2*y_padding)

                    switch(e.type) {
                        case "FlyRight":
                        case "FlyLeft":
                            const image = e.renderSetting.image as HTMLImageElement
                            if(image) context.drawImage(image, e.x,e.y, e.width, e.height)
                            break;
                        default:        
                    }

                    
                } 
            })
        })
    }

    generateBlock<T extends BlockType>(x:number, y:number, type: BlockType, opt?: BlockAdditionalSetting<T>) {
        this._map.pushBlock(x,y,type, opt)
    }

    ball_h_acc(time: DOMHighResTimeStamp) {
        if(this._keyObserver.right) {
            this._keyPressedTimeStamp.right = time
            
            this._ball.move("right");
        }
        if(this._keyObserver.left) {
            this._keyPressedTimeStamp.left = time
            
            this._ball.move("left");
        }
        if(!this._keyObserver.right && !this._keyObserver.left) this._ball.h_stop();
    }

    ball_h_move() {
        
        if(this._ball.flyStatus) this._ball.fly(this._ball.flyStatus)
        
        this._ball.h_move()
        
        if((this._keyObserver.left && this._ball.flyStatus === "FlyRight") 
        || (this._keyObserver.right && this._ball.flyStatus === "FlyLeft")) {
            this._ball.flyStatus = false;
            this.bounceAudioPlay("Drift");    
        }
        
    }


    initializeBall(coord: Coordinate) {
        this._prevCoordinate.x = coord.x; this._prevCoordinate.y = coord.y
        this._ball.initializeBall(coord)
    }

    private toNextStage() {
        this._stage += 1;
        this._stageBackgroundRenderer && this._stageBackgroundRenderer();
    }

    private toPrevStage() {
        this._stage -= 1;
        this._stageBackgroundRenderer && this._stageBackgroundRenderer()
    }

    
    private gameDead() {
        this._stop = true
        this._gameDeadMessageRenderer && this._gameDeadMessageRenderer()
    }

    protected attachCanvas(root: HTMLElement) {
        root.appendChild(this._canvas);
    }
}