import { BLOCK_WIDTH, BLOCK_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constant.js";
import { Block } from "../block/baseBl.js";
export class Map {
    constructor() {
        this._matrix = [];
        this._horizontalN = CANVAS_WIDTH / BLOCK_WIDTH;
        this._verticalN = CANVAS_HEIGHT / BLOCK_HEIGHT;
        for (let i = 0; i < this._verticalN; i++) {
            const row = [];
            for (let j = 0; j < this._horizontalN; j++)
                row.push(null);
            this._matrix.push(row);
        }
    }
    get matrix() {
        return this._matrix;
    }
    initializeMatrix() {
        for (let i = 0; i < this._verticalN; i++) {
            for (let j = 0; j < this._horizontalN; j++) {
                if (this._matrix[i][j])
                    this.deleteBlock(j, i);
            }
            ;
        }
    }
    pushBlock(x, y, type, opt) {
        if (x >= CANVAS_WIDTH / BLOCK_WIDTH || y >= CANVAS_HEIGHT / BLOCK_HEIGHT)
            throw new Error('unvaild coordinate, so can\'t generate block');
        if (type === "WormholeStart") {
            if (!opt)
                throw new Error("wormhole should have extra option");
            const startBlock = new Block(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, type, opt);
            this._matrix[y][x] = startBlock;
            const option = opt;
            const endBlock = new Block(option.x_endPoint * BLOCK_WIDTH, option.y_endPoint * BLOCK_HEIGHT, "WormholeEnd", { start: false });
            this._matrix[option.y_endPoint][option.x_endPoint] = endBlock;
            return;
        }
        const block = new Block(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, type);
        this._matrix[y][x] = block;
    }
    deleteBlock(x, y) {
        if (x >= CANVAS_WIDTH / BLOCK_WIDTH && y >= CANVAS_HEIGHT / BLOCK_HEIGHT)
            throw new Error('unvaild coordinate, so can\'t delete block');
        this._matrix[y][x] = null;
    }
}
