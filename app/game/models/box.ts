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
    return this;
  }
}

// Make the box clickable and change color
export function boxMakeInteractive(box: Box) {
  box.sprite = Sprite.from('assets/images/boxInteractive.png');
  box.sprite.interactive = true;
  box.sprite.cursor = 'pointer';
  box.sprite.on('pointertap', boxOnClick);
}

// What happens when you click on a box
export function boxOnClick() {}
