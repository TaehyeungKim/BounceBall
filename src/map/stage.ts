import { Coordinate } from "../ball/ball.js";
import { BlockType, BlockAdditionalSetting } from "../block/baseBl.js"

import { CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from "../constant.js";

type StageGenerator = {
    [k in number]: (generator: (
        x:number, y:number,type: BlockType, opt?: BlockAdditionalSetting<BlockType>
    )=>void, initializer: (coord: Coordinate)=>void) => void|true
}

const h_end = CANVAS_WIDTH/BLOCK_WIDTH - 1;
const v_end = CANVAS_HEIGHT/BLOCK_HEIGHT - 1


export const stageBnd: StageGenerator = {
    0: (generator, initializer)=>{
        initializer({x: 50,y: 200})
        
        for(let i=0; i <= v_end; i++) {
            generator(h_end, i,"End")
        }
        for(let k = 0; k <= h_end; k++) {
            if(k < h_end-4 || k > h_end-2) generator(k, v_end,  'Normal')
            if(k < h_end-4 || k > h_end-2) generator(k, v_end-1,  'Normal')
            if(k > h_end-23) if(k < h_end-4 || k > h_end-2) generator(k, v_end-2,  'Normal')
            if (k > h_end-19) if(k < h_end-4 || k > h_end-2) generator(k, v_end-3,  'Normal')
            if(k>h_end-15) if(k < h_end-4 || k > h_end-2) generator(k, v_end-4,  'Normal')
            if (k > h_end-13) if(k < h_end-4 || k > h_end-2) generator(k, v_end-5,  'Normal')
            if(k>h_end-9) {
                if(k < h_end-4 || k > h_end-2) {
                    generator(k, v_end-6,  'Normal')
                    generator(k, v_end-7,  'Normal')
                }
            }
        }
        for(let j = 0; j <= v_end-1; j++) generator(0,j, 'Normal')
    },
    1: (generator, initializer) => {
        initializer({x: 60, y: 200})
        
        for(let j = 0; j < v_end; j++) 
        generator(0, j, "Normal")
        for(let k = 0; k <= h_end; k++) {
            generator(k, v_end, "Normal");
            if(k === h_end-23) break;
        }
        for(let k = 1; k <= h_end; k++) generator(k,0, "Normal")
        generator(11, v_end, "Jump")
        for(let k = 14; k < 20; k++) generator(k, v_end - 7, "Normal")
        generator(20, v_end - 7, "Jump")

        for(let k = 25; k < 29; k++) generator(k, v_end - 12,"Normal")
        generator(29, v_end - 12, "Jump")

        for(let j = 1; j <= v_end; j++) {
            if(j < 7) generator(h_end, j, "End")
            else generator(h_end, j, "Normal")
        }

    },
    2: (g, i) => {
        i({x: 50, y: 420})
        for(let j = 0; j <= v_end; j++) {
            if(j === 0 || j >= v_end-19) g(0,j,"Normal")
            else g(0,j, "End")
            g(h_end, j, "Normal")
        }
        for(let m = 1; m < h_end; m++) g(m,0,"Normal")
        for(let l = 1; l < h_end-2; l++) g(l, v_end - 19, "Normal")

        for(let k = 1; k < h_end-1; k++) {
            if(k%5 === 1 || k%5 === 2) g(k, v_end, "Normal")
            else g(k, v_end, "Bomb")        
        }
        g(h_end-1, v_end, "Jump")

        for(let j = h_end-3; j > 1; j--) {
            if(j%5 === 1 || j%5 === 2) g(j, v_end-6, "Normal")
            else g(j, v_end-6, "Bomb")
        }
        g(1, v_end-6, "Jump")

        g(3, v_end-13, "Normal")
        for(let k=4; k < h_end-1; k++) {
            if(k%3 === 1 || k%3 === 2) g(k, v_end-13, "Bomb")
            else g(k, v_end-13, "Normal")
        }
        g(h_end-1, v_end-13, "Jump")
    },
    3: (g,i) => {
        i({x: 30, y: 400})
        for(let i = 0; i <= h_end; i++) {
            if(i > 0 && i < Math.floor((h_end/4))*1) g(i, v_end, "Normal")
            else if( i > Math.floor((h_end/4))*1 && i < Math.floor((h_end/4))*2) g(i, v_end, "Bomb")
            else if(i > Math.floor((h_end/4))*2 && i < Math.floor((h_end/4))*3) g(i, v_end, "Fragile")
            else if(i > Math.floor((h_end/4))*3) g(i, v_end, "Normal")
        }
        for(let j = 0; j <= v_end; j++) {
            g(0,j,"Normal")
            g(Math.floor((h_end/4))*1, j, "Normal")
            g(Math.floor((h_end/4))*2, j, "Normal")
            g(Math.floor((h_end/4))*3, j, "Normal")
        }
        for(let k = 2; k < Math.floor((h_end/4))*1; k++) {
            for(let j = k-1; j > 0; j--) {
                g(k, v_end-j, "Normal")
                g(k, v_end-(j+13), "Normal")
            }
        }
        for(let k = Math.floor((h_end/4))*1-3; k >= 1; k--) {
            for(let j = k-1; j < Math.floor((h_end/4))*1-3; j++) g(k, j+(v_end-12), "Normal")
        }
        g(3,3,"WormholeStart", {x_endPoint: 13, y_endPoint: 13, start: true})
        

        for(let j = 1; j < 4; j++) g(Math.floor((h_end/4))*1 + j, v_end-4, "Normal")
        g(Math.floor((h_end/4))*1 + 4, v_end-4, "Jump")
        g(Math.floor((h_end/4))*1 + 3, v_end-11, "Jump")

        g(13, 5, "WormholeStart", {x_endPoint: 20, y_endPoint: 15, start: true})

        for(let j = 1; j < 4; j++) {
            if(j === 3) g(Math.floor((h_end/4))*3-j, v_end-2, "Jump")
            else g(Math.floor((h_end/4))*3-j, v_end-2, "Normal")
        }

        for(let j = 1; j < 4; j++) {
            if(j === 1) g(Math.floor((h_end/4))*2+j, 15, "Jump")
            else g(Math.floor((h_end/4))*2+j, 15, "Bomb")
        }

        g(Math.floor((h_end/4))*2+4, v_end-15, "Normal")
        g(Math.floor((h_end/4))*2+4, v_end-19, "Normal")
        g(Math.floor((h_end/4))*2+6, v_end - 17, "Normal")
        g(Math.floor((h_end/4))*2+2, v_end - 21, "WormholeStart", {x_endPoint: 27, y_endPoint: 20, start: true})

        for(let j = 0; j <= v_end-1; j++) {
            g(h_end, j, "End")
        }
    },
    4: (g, i) => {
        i({x: 80, y:300});
        for(let i = 0; i <= h_end; i++) g(i,0, "Normal")
        for(let k = 1; k <= v_end; k++) {
            g(0,k,"Normal")
            
            g(h_end, k, "Normal")

            if(k > v_end - 17) {
                g(5, k, "Normal")
                g(6, k, "Normal")
                g(7, k, "Normal")
                if(k%5 === 0) {
                    for(let j = 8; j <= h_end - 4; j++) g(j, k, "Bomb");
                    
                    for(let j = h_end-1; j >=12; j--) g(j, k+3, "Bomb")
                    
                    
                    if(k+4 <= v_end) g(9, k+4, "FlyRight")
                    g(h_end-2, k+2, "FlyLeft")
                }
            }
            if(k > v_end - 5) {
                g(1, k, "Fragile")
                g(2, k, "Fragile")
                g(3, k, "Fragile")
                g(4, k, "Fragile")
            }
        }
        g(11, 6, "FlyRight")
        for(let j = 8; j < 12; j++) g(j, v_end, "End")
        
    },
    5: (g,i) => {
        return true
    }
}