import { Sprite } from 'pixi.js';
import { BLOCK_DIMENSION, PADDING } from './box';

// Class Pawn with its texture, coordinates, dimension
export class Pawn {
  sprite: Sprite;
  x: number;
  y: number;

  constructor(id: boolean) {
    this.sprite = Sprite.from('assets/images/rocket.png');

    // If the paws is of the first player, put it on (0,2), otherwise (7,3)
    if (!id) {
      this.x = 0;
      this.y = 2;
    } else {
      this.x = 7;
      this.y = 3;
    }

    this.sprite.x = this.x * (BLOCK_DIMENSION + PADDING);
    this.sprite.y = this.y * (BLOCK_DIMENSION + PADDING);
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.on('pointertap', () => pawnOnClick(this));
    return this;
  }

  makePawnInteractive(): void {
    this.sprite.interactive = true;
    this.sprite.cursor = 'pointer';
  }
}

// What happens when you click on the pawn
export function pawnOnClick(pawn: Pawn): void  {
  console.log("Hey, you clicked on the pawn!");
  //boxes[pawn.x][pawn.y]
}
