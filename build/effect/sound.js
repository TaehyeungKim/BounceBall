const Normal = new Audio("./build/effect/sounds/normal_bounce.mp3");
const Jump = new Audio("./build/effect/sounds/jump_bounce.wav");
const Bomb = new Audio("../build/effect/sounds/bomb_bounce.mp3");
const Fragile = new Audio("../build/effect/sounds/fragile_bounce.mp3");
const WormholeEnd = Normal;
const WormholeStart = new Audio("../build/effect/sounds/wormhole_bounce.wav");
const End = new Audio("../build/effect/sounds/end_bounce.mp3");
const Fly = new Audio("./build/effect/sounds/fly.mp3");
const JumpTheWall = new Audio('../build/effect/sounds/jumpTheWall.mp3');
const Drift = new Audio("./build/effect/sounds/drift.mp3");
export const BounceAudio = {
    "Normal": Normal,
    "Jump": Jump,
    "Bomb": Bomb,
    "Fragile": Fragile,
    "WormholeEnd": WormholeEnd,
    "End": End,
    "WormholeStart": WormholeStart,
    "FlyLeft": Fly,
    "FlyRight": Fly,
    "JumpTheWall": JumpTheWall,
    "Drift": Drift
};
