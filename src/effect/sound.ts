import { BlockType } from "../block/baseBl.js";
import { SpecialBallMove } from "../controller/controller.js";
import * as Sounds from "./re-export.js";

type BounceAudioEffect = {
  [k in BlockType | SpecialBallMove]?: HTMLAudioElement;
};

export const BounceAudio: BounceAudioEffect = {
  ...Sounds,
};
