import { Sprite } from 'pixi.js';
import { BLOCK_DIMENSION, PADDING } from './box';

const CHECKBOARD_HEIGHT = 6;
const CHECKBOARD_WIDTH = 8;

// Class Pawn with its texture, coordinates, dimension
export class Pawn {
  x: number;
  y: number;
  sprite: Sprite;
  adjacent: number[][];
  onMove: boolean;

  constructor(id: boolean) {
    // If the paws is of the first player, put it on (0,2), otherwise (7,3)
    if (!id) {
      this.x = 0;
      this.y = 2;
    } else {
      this.x = 7;
      this.y = 3;
    }

    // Compute the coordinates of the adjacent boxes
    this.adjacent = [];
    if (this.x > 0) {
      this.adjacent.push([this.x-1,this.y]);
    }
    if (this.y > 0) {
      this.adjacent.push([this.x,this.y-1]);
    }
    if (this.x < CHECKBOARD_WIDTH-1) {
      this.adjacent.push([this.x+1,this.y]);
    }
    if (this.y < CHECKBOARD_HEIGHT-1) {
      this.adjacent.push([this.x,this.y+1]);
    }

    this.onMove = false;
    this.sprite = Sprite.from('assets/images/rocket.png');
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

  updatePosition(): void{
    this.sprite.x = this.x * (BLOCK_DIMENSION + PADDING);
    this.sprite.y = this.y * (BLOCK_DIMENSION + PADDING);
    this.adjacent = [];
    if (this.x > 0) {
      this.adjacent.push([this.x-1,this.y]);
    }
    if (this.y > 0) {
      this.adjacent.push([this.x,this.y-1]);
    }
    if (this.x < CHECKBOARD_WIDTH-1) {
      this.adjacent.push([this.x+1,this.y]);
    }
    if (this.y < CHECKBOARD_HEIGHT-1) {
      this.adjacent.push([this.x,this.y+1]);
    }
  }
}

// What happens when you click on the pawn
export function pawnOnClick(pawn: Pawn): void  {
  console.log("Hey, you clicked on the pawn!");
  pawn.onMove = !pawn.onMove;
}
