import { Sprite } from 'pixi.js';

export const BLOCK_DIMENSION = 40;
export const PADDING = 5;

// The checkboard is made of boxes
export class Box {
  sprite: Sprite;

  constructor() {
    this.sprite = Sprite.from('assets/images/box.png');
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.interactive = false;
    this.sprite.on('pointertap', () => boxOnClick());
    return this;
  }

  makeInteractive(): void {
    this.sprite = Sprite.from('assets/images/boxInteractive.png');
    this.sprite.interactive = true;
    this.sprite.cursor = 'pointer';
  }
}


// What happens when you click on a box
export function boxOnClick() {
  console.log("Hey, you clicked on the box!");

}
