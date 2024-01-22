import { BlockType } from "../block/baseBl.js"

type BounceAudioEffect = {
    [k in BlockType]?: HTMLAudioElement
}


const Normal = new Audio("./build/effect/sounds/normal_bounce.mp3");
const Jump = new Audio("./build/effect/sounds/jump_bounce.wav");
const Bomb = new Audio("../build/effect/sounds/bomb_bounce.mp3");
const Fragile = new Audio("../build/effect/sounds/fragile_bounce.mp3");
const WormholeEnd = Normal
const WormholeStart = new Audio("../build/effect/sounds/wormhole_bounce.wav")
const End = new Audio("../build/effect/sounds/end_bounce.mp3")    

export const BounceAudio: BounceAudioEffect = {
    "Normal": Normal,
    "Jump": Jump,
    "Bomb": Bomb,
    "Fragile": Fragile,
    "WormholeEnd": WormholeEnd,
    "End": End,
    "WormholeStart": WormholeStart
}