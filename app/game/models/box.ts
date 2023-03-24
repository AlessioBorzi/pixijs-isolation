import { Sprite, Texture } from "pixi.js";

export const BLOCK_DIMENSION = 40;
export const PADDING = 5;

// The checkboard is made of boxes
export class Box {
  sprite: Sprite;
  move: boolean;

  constructor() {
    this.move = false;
    this.sprite = Sprite.from("assets/images/box.png");
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.interactive = false;
    this.sprite.on("pointertap", () => boxOnClick(this));
    return this;
  }

  update(interactive: boolean): void {
    if (interactive) {
      this.sprite.texture = Texture.from("assets/images/boxInteractive.png");
      this.sprite.interactive = true;
      this.sprite.cursor = "pointer";
    } else {
      this.sprite.texture = Texture.from("assets/images/box.png");
      this.sprite.interactive = false;
      this.sprite.cursor = "cursor";
    }
  }
}

// What happens when you click on a box
export function boxOnClick(box: Box): void {
  console.log("Hey, you clicked on the box!");
  box.move = true;
}
