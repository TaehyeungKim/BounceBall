import { BLOCK_WIDTH, BLOCK_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { Block, BlockType, BlockAdditionalSetting } from "../block/baseBl.js";

export class Map {
    private _horizontalN: number;
    private _verticalN: number
    private _matrix: Array<Array<Block<BlockType>|null>> = []
    constructor() {
        this._horizontalN = CANVAS_WIDTH/BLOCK_WIDTH;
        this._verticalN = CANVAS_HEIGHT/BLOCK_HEIGHT;
        this.initializeMatrix();
    }

    get matrix() {
        return this._matrix
    }

    initializeMatrix() {
        for(let i = 0; i < this._verticalN; i++) {
            const row = [];
            for(let j = 0; j < this._horizontalN; j++) row.push(null);
            this._matrix.push(row);
        }
    }

    pushBlock<T extends BlockType>(x:number,y:number,w:number,h:number,type: T, opt?: BlockAdditionalSetting<T>) {
        if(x >= CANVAS_WIDTH/BLOCK_WIDTH || y >= CANVAS_HEIGHT/BLOCK_HEIGHT) throw new Error('unvaild coordinate, so can\'t generate block');

        if(type === "WormholeStart") {
            if(!opt) throw new Error("wormhole should have extra option")
            const startBlock = new Block<"WormholeStart">(x*BLOCK_WIDTH, y*BLOCK_HEIGHT, w,h,type, opt as BlockAdditionalSetting<"WormholeStart">)
            this._matrix[y][x] = startBlock

            const option = opt as BlockAdditionalSetting<"WormholeStart">;
            const endBlock = new Block<"WormholeEnd">(
                option.x_endPoint*BLOCK_WIDTH, 
                option.y_endPoint*BLOCK_HEIGHT, 
                w, h, "WormholeEnd",{start: false})
            this._matrix[option.y_endPoint][option.x_endPoint] = endBlock;

            return ;
        }
        
        const block = new Block<T>(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,w,h,type)
        
        this._matrix[y][x] = block;
    }

    deleteBlock(x:number,y:number) {
        if(x >= CANVAS_WIDTH/BLOCK_WIDTH && y >= CANVAS_HEIGHT/BLOCK_HEIGHT) throw new Error('unvaild coordinate, so can\'t delete block');
        this._matrix[y][x] = null;
    }
}