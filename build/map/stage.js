import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
export const stageBnd = {
    stage_0: (generator, initializer) => {
        initializer({ x: 40, y: 400 });
        for (let k = 0; k < CANVAS_WIDTH / BLOCK_WIDTH; k++) {
            if (k < 26 || k > 28)
                generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 1, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k < 26 || k > 28)
                generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 2, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k > 7)
                if (k < 26 || k > 28)
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 3, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k > 11)
                if (k < 26 || k > 28)
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 4, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k > 15)
                if (k < 26 || k > 28)
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 5, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k > 19)
                if (k < 26 || k > 28)
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 6, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
            if (k > 23) {
                if (k < 26 || k > 28) {
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 7, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
                    generator(k, CANVAS_HEIGHT / BLOCK_HEIGHT - 8, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
                }
            }
        }
        for (let j = 0; j < CANVAS_HEIGHT / BLOCK_WIDTH - 2; j++)
            generator(0, j, BLOCK_WIDTH, BLOCK_HEIGHT, 'Normal');
    }
};
