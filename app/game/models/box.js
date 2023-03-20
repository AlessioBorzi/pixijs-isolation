export const BLOCK_DIMENSION = 40;

// The checkboard is made of boxes
export class Box {
  constructor(id) {
    this.sprite = PIXI.Sprite.fromImage("static/images/box.png");
    this.sprite.id = id; // it is an array [a,b]
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.interactive = false;
    return this;
  }
}

// Make the box clickable and change color
export function boxMakeInteractive(box) {
  box.sprite = PIXI.Sprite.fromImage("static/images/boxInteractive.png");
  box.sprite.interactive = true;
  box.sprite.cursor = 'pointer';
  box.on('pointertap', boxOnClick);
}

// What happens when you click on a box
export function boxOnClick() {

}
