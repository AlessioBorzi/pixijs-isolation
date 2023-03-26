import { Sprite } from "pixi.js";
import { BLOCK_DIMENSION, PADDING } from "./box";

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

    this.onMove = false;
    this.sprite = Sprite.from("assets/images/rocket.png");
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.on("pointertap", () => pawnOnClick(this));

    this.updatePosition();

    return this;
  }

  makePawnInteractive(interactive: boolean): void {
    this.sprite.interactive = interactive;
    this.sprite.cursor = interactive ? "pointer" : "cursor";
  }

  updatePosition(): void {
    this.sprite.x = this.x * (BLOCK_DIMENSION + PADDING);
    this.sprite.y = this.y * (BLOCK_DIMENSION + PADDING);
    this.adjacent = [];

    /* Compute the coordinates of the adjacent boxes */

    // left
    if (this.x > 0) {
      this.adjacent.push([this.x - 1, this.y]);

      // top left
      if (this.y > 0) {
        this.adjacent.push([this.x - 1, this.y - 1]);
      }

      // bottom left
      if (this.y < CHECKBOARD_HEIGHT - 1) {
        this.adjacent.push([this.x - 1, this.y + 1]);
      }
    }

    // right
    if (this.x < CHECKBOARD_WIDTH - 1) {
      this.adjacent.push([this.x + 1, this.y]);

      // top right
      if (this.y > 0) {
        this.adjacent.push([this.x + 1, this.y - 1]);
      }

      // bottom right
      if (this.y < CHECKBOARD_HEIGHT - 1) {
        this.adjacent.push([this.x + 1, this.y + 1]);
      }
    }

    // top
    if (this.y < CHECKBOARD_HEIGHT - 1) {
      this.adjacent.push([this.x, this.y + 1]);
    }

    // bottom
    if (this.y > 0) {
      this.adjacent.push([this.x, this.y - 1]);
    }
  }
}

// What happens when you click on the pawn
export function pawnOnClick(pawn: Pawn): void {
  console.log("Hey, you clicked on the pawn!");
  pawn.onMove = !pawn.onMove;
}
