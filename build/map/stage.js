import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";
const h_end = CANVAS_WIDTH / BLOCK_WIDTH - 1;
const v_end = CANVAS_HEIGHT / BLOCK_HEIGHT - 1;
export const stageBnd = {
    0: (generator, initializer) => {
        initializer({ x: 40, y: 400 });
        for (let i = 0; i <= v_end; i++) {
            generator(h_end, i, "End");
        }
        for (let k = 0; k <= h_end; k++) {
            if (k < 26 || k > 28)
                generator(k, v_end, 'Normal');
            if (k < 26 || k > 28)
                generator(k, v_end - 1, 'Normal');
            if (k > 7)
                if (k < 26 || k > 28)
                    generator(k, v_end - 2, 'Normal');
            if (k > 11)
                if (k < 26 || k > 28)
                    generator(k, v_end - 3, 'Normal');
            if (k > 15)
                if (k < 26 || k > 28)
                    generator(k, v_end - 4, 'Normal');
            if (k > 19)
                if (k < 26 || k > 28)
                    generator(k, v_end - 5, 'Normal');
            if (k > 23) {
                if (k < 26 || k > 28) {
                    generator(k, v_end - 6, 'Normal');
                    generator(k, v_end - 7, 'Normal');
                }
            }
        }
        for (let j = 0; j <= v_end - 1; j++)
            generator(0, j, 'Normal');
    },
    1: (generator, initializer) => {
        initializer({ x: 60, y: 300 });
        for (let j = 0; j < v_end; j++)
            generator(0, j, "Normal");
        for (let k = 0; k <= h_end; k++) {
            generator(k, v_end, "Normal");
            if (k === 10)
                break;
        }
        for (let k = 1; k <= h_end; k++)
            generator(k, 0, "Normal");
        generator(11, v_end, "Jump");
        for (let k = 14; k < 20; k++)
            generator(k, v_end - 7, "Normal");
        generator(20, v_end - 7, "Jump");
        for (let k = 25; k < 29; k++)
            generator(k, v_end - 12, "Normal");
        generator(29, v_end - 12, "Jump");
        for (let j = 1; j <= v_end; j++) {
            if (j < 7)
                generator(h_end, j, "End");
            else
                generator(h_end, j, "Normal");
        }
    }
};
