import { Sprite, Texture } from "pixi.js";
import { Cursor, GameSprite } from "./game.model";

export const BLOCK_DIMENSION = 80;
export const PADDING = 10;

// The checkboard is made of boxes
export class Box {
  sprite: GameSprite;
  move: boolean;
  waitForMove: boolean;
  removed: boolean;
  justRemoved: boolean;

  constructor() {
    this.waitForMove = false;
    this.move = false;
    this.removed = false;
    this.justRemoved = false;
    this.sprite = Sprite.from("assets/images/box.png") as GameSprite;
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.interactive = false;
    this.sprite.on("pointertap", () => boxOnClick(this));
    return this;
  }

  update(interactive: boolean): void {
    this.sprite.interactive = interactive;

    if (interactive) {
      if (this.waitForMove) {
        this.sprite.texture = Texture.from("assets/images/boxInteractive.png");
      }
      this.sprite.cursor = Cursor.POINTER;
    } else {
      const image = this.removed ? "assets/images/boxRemoved.png" : "assets/images/box.png";
      this.sprite.texture = Texture.from(image);
      this.sprite.cursor = Cursor.DEFAULT;
    }
  }

  remove(): void {
    this.removed = true;
    this.sprite.texture = Texture.from("assets/images/boxRemoved.png");
  }
}

// What happens when you click on a box
export function boxOnClick(box: Box): void {
  console.log("Hey, you clicked on the box! (" + box.sprite.x + "," + box.sprite.y + ")");
  if (box.waitForMove) {
    box.move = true;
  } else {
    box.removed = true;
    box.justRemoved = true;
    console.log("Box removed");
  }
}
