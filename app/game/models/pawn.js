import {BLOCK_DIMENSION } from "./box.js";

// Class Pawn with its texture, coordinates, dimension
export class Pawn {
  constructor(id) {
    this.sprite = PIXI.Sprite.fromImage("static/images/rocket.png");
    this.sprite.id = id; // a number (0 or 1)
    // If the paws is of the first player, put it on (0,2), otherwise (7,3)
    if (id == 0) {
      this.x = 0;
      this.y = 2;
    }
    else {
      this.x = 7;
      this.y = 3;
    }
    this.sprite.x = this.x * (BLOCK_DIMENSION + 5);
    this.sprite.y = this.y * (BLOCK_DIMENSION + 5);
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.interactive = true;
    this.sprite.cursor = 'pointer';
    this.sprite.on('pointertap', pawnOnClick);
    return this;
  }
}

// What happens when you click on the pawn
export function pawnOnClick() {

}
