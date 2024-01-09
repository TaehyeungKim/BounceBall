import { BLOCK_WIDTH, BLOCK_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { Block } from "../block/baseBl.js";
export class Map {
    constructor() {
        this._matrix = [];
        this._horizontalN = CANVAS_WIDTH / BLOCK_WIDTH;
        this._verticalN = CANVAS_HEIGHT / BLOCK_HEIGHT;
        this.initializeMatrix();
        console.log(this._matrix);
    }
    get matrix() {
        return this._matrix;
    }
    initializeMatrix() {
        for (let i = 0; i < this._verticalN; i++) {
            const row = [];
            for (let j = 0; j < this._horizontalN; j++)
                row.push(null);
            this._matrix.push(row);
        }
    }
    pushBlock(x, y, w, h, type) {
        if (x >= CANVAS_WIDTH / BLOCK_WIDTH || y >= CANVAS_HEIGHT / BLOCK_HEIGHT)
            throw new Error('unvaild coordinate, so can\'t generate block');
        console.log(x >= CANVAS_WIDTH / BLOCK_WIDTH, CANVAS_HEIGHT / BLOCK_HEIGHT);
        const block = new Block(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, w, h, type);
        this._matrix[y][x] = block;
    }
    deleteBlock(x, y) {
        if (x >= CANVAS_WIDTH / BLOCK_WIDTH && y >= CANVAS_HEIGHT / BLOCK_HEIGHT)
            throw new Error('unvaild coordinate, so can\'t delete block');
        this._matrix[y][x] = null;
    }
}
