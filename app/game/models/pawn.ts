import { Sprite } from "pixi.js";
import { BLOCK_DIMENSION, PADDING } from "./box";
import { Cursor, GameSprite } from "./game.model";

const CHECKBOARD_HEIGHT = 6;
const CHECKBOARD_WIDTH = 8;

// Class Pawn with its texture, coordinates, dimension
export class Pawn {
  x: number;
  y: number;
  sprite: GameSprite;
  adjacent: number[][];
  onMove: boolean;

  constructor(id: boolean) {
    // If the pawn is of the first player, put it on (0,2), otherwise (7,3)
    if (!id) {
      this.x = 0;
      this.y = 2;
      this.sprite = Sprite.from("assets/images/pawnRed.png") as GameSprite;
    } else {
      this.x = 7;
      this.y = 3;
      this.sprite = Sprite.from("assets/images/pawnBlue.png") as GameSprite;
    }

    this.onMove = false;
    this.sprite.height = BLOCK_DIMENSION;
    this.sprite.width = BLOCK_DIMENSION;
    this.sprite.on("pointertap", () => pawnOnClick(this));

    this.updatePosition();

    return this; // is necessary?
  }

  makePawnInteractive(interactive: boolean): void {
    this.sprite.interactive = interactive;
    this.sprite.cursor = interactive ? Cursor.POINTER : Cursor.DEFAULT;
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
