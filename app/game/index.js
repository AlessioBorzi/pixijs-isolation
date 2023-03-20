import KeyListener from "./helpers/keylistener.js";
import Socket from "./helpers/sockets.js";
import { Pawn, pawnOnClick } from "./models/pawn.js";
import { Box, BLOCK_DIMENSION } from "./models/box.js";

// Create the app with a black background
const app = new PIXI.Application(800, 600, { backgroundColor: 0x000000 });
document.getElementById("game").appendChild(app.view);

// I dont know yet what these two commands do
const socket = new Socket();
const Listener = new KeyListener();

// Make checkboard
const checkboard = new PIXI.Container();
const boxes = [];

// Create a 6x8 grid of boxes
const checkboardHeight = 6;
const checkboardWidth = 8;
for (let j = 0; j < checkboardHeight; j++) {
  boxes.push([]);
  for (let i = 0; i < checkboardWidth; i++) {
    let box = new Box([i,j]);
    box.sprite.x = i * (BLOCK_DIMENSION + 5);
    box.sprite.y = j * (BLOCK_DIMENSION + 5);
    checkboard.addChild(box.sprite);
    boxes[j].push(box);
  }
}

// Make the two pawns
const pawn1 = new Pawn(0);
const pawn2 = new Pawn(1);
checkboard.addChild(pawn1.sprite);
checkboard.addChild(pawn2.sprite);

// Move checkerboard to the center
checkboard.x = app.screen.width / 2;
checkboard.y = app.screen.height / 2;
// Center box sprite in local container coordinates
checkboard.pivot.x = checkboard.width / 2;
checkboard.pivot.y = checkboard.height / 2;

app.stage.addChild(checkboard);
