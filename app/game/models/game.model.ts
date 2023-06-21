import { Sprite } from "pixi.js";

export const enum Cursor {
  DEFAULT = "cursor",
  POINTER = "pointer",
}

export interface GameSprite extends Sprite {
  interactive: boolean;
  cursor: Cursor;
  on: (inp: string, callback: () => void) => void;
}
