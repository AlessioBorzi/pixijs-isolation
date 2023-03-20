import { Sprite } from 'pixi.js';
import { BLOCK_DIMENSION } from './box';

// Class Pawn with its texture, coordinates, dimension
export class Pawn {
  sprite: Sprite;
  x: number;
  y: number;

  constructor(id: 0 | 1) {
    this.sprite = Sprite.from('assets/images/rocket.png');
    (this.sprite as any).id = id;

    // If the paws is of the first player, put it on (0,2), otherwise (7,3)
    if (id == 0) {
      this.x = 0;
      this.y = 2;
    } else {
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
export function pawnOnClick() {}
