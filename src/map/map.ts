import { BLOCK_WIDTH, BLOCK_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { Block, BlockType } from "../block/baseBl.js";

export class Map {
    private _horizontalN: number;
    private _verticalN: number
    private _matrix: Array<Array<Block|null>> = []
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

    pushBlock(x:number,y:number,w:number,h:number,type: BlockType) {
        if(x >= CANVAS_WIDTH/BLOCK_WIDTH || y >= CANVAS_HEIGHT/BLOCK_HEIGHT) throw new Error('unvaild coordinate, so can\'t generate block');
        
        const block = new Block(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,w,h,type)
        
        this._matrix[y][x] = block;
    }

    deleteBlock(x:number,y:number) {
        if(x >= CANVAS_WIDTH/BLOCK_WIDTH && y >= CANVAS_HEIGHT/BLOCK_HEIGHT) throw new Error('unvaild coordinate, so can\'t delete block');
        this._matrix[y][x] = null;
    }
}