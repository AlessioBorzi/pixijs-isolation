import './css/style.css';

import { Pawn, pawnOnClick } from './game/models/pawn';
import { Box, BLOCK_DIMENSION, PADDING } from './game/models/box';
import { Application, Container } from 'pixi.js';
import KeyListener from './game/helpers/keylistener';
import { Socket } from './game/helpers/sockets';

const GAME_WIDTH = 800;
const GAME_HEIGTH = 600;

// Create the app with a black background
const app = new Application({
  backgroundColor: 0x000000,
  width: GAME_WIDTH,
  height: GAME_HEIGTH,
});

document.body.appendChild(app.view);

// I dont know yet what these two commands do
const socket = new Socket();
const Listener = new KeyListener();

// Make checkboard
const checkboard = new Container();
const boxes = [];

// Create a 6x8 grid of boxes
const checkboardHeight = 6;
const checkboardWidth = 8;
for (let j = 0; j < checkboardHeight; j++) {
  boxes.push([]);
  for (let i = 0; i < checkboardWidth; i++) {
    const box = new Box();
    box.sprite.x = i * (BLOCK_DIMENSION + PADDING);
    box.sprite.y = j * (BLOCK_DIMENSION + PADDING);
    checkboard.addChild(box.sprite);
    boxes[j].push(box);
  }
}

// Make the two pawns
const pawn0 = new Pawn(false);
const pawn1 = new Pawn(true);
checkboard.addChild(pawn0.sprite);
checkboard.addChild(pawn1.sprite);

// Move checkerboard to the center
checkboard.x = app.screen.width / 2;
checkboard.y = app.screen.height / 2;
// Center box sprite in local container coordinates
checkboard.pivot.x = checkboard.width / 2;
checkboard.pivot.y = checkboard.height / 2;

app.stage.addChild(checkboard);

// Client

function sendData(): void {
  socket.send({
    type: 'input',
    data: 'Hello World', //this is temporary of course
  });
}

socket.connection.onmessage = (signal) => {
  const payload = JSON.parse(signal.data);
  switch (payload.type) {
    case 'init':
      console.log('Hello World');
      break;
    case 'update':
      console.log('Hello World');
      break;
    default:
      break;
  }
};

app.ticker.add((delta) => {});
