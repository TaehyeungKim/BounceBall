// export { default as Normal } from "@_build/effect/sounds/normal_bounce.mp3";
// export { default as Bomb } from "@_build/effect/sounds/bomb_bounce.mp3";
// export { default as Jump } from "@_build/effect/sounds/jump_bounce.wav";
// export { default as Fragile } from "@_build/effect/sounds/fragile_bounce.mp3";
// export { default as WormholeStart } from "@_build/effect/sounds/wormhole_bounce.wav";
// export { default as End } from "@_build/effect/sounds/end_bounce.mp3";
// export { default as Fly } from "@_build/effect/sounds/fly.mp3";
// export { default as JumpTheWall } from "@_build/effect/sounds/jumpTheWall.mp3";
// export { default as Drift } from "@_build/effect/sounds/drift.mp3";

export const Normal = new Audio("./build/effect/sounds/normal_bounce.mp3");
export const Jump = new Audio("./build/effect/sounds/jump_bounce.wav");
export const Bomb = new Audio("./build/effect/sounds/bomb_bounce.mp3");
export const Fragile = new Audio("./build/effect/sounds/fragile_bounce.mp3");
export const WormholeEnd = Normal;
export const WormholeStart = new Audio(
  "./build/effect/sounds/wormhole_bounce.wav"
);
export const End = new Audio("./build/effect/sounds/end_bounce.mp3");
export const FlyRight = new Audio("./build/effect/sounds/fly.mp3");
export const FlyLeft = new Audio("./build/effect/sounds/fly.mp3");

export const JumpTheWall = new Audio("./build/effect/sounds/jumpTheWall.mp3");
export const Drift = new Audio("./build/effect/sounds/drift.mp3");
