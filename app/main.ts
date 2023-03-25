import "./css/style.css";

import { Pawn, pawnOnClick } from "./game/models/pawn";
import { Box, BLOCK_DIMENSION, PADDING } from "./game/models/box";
import { Application, Container } from "pixi.js";
import KeyListener from "./game/helpers/keylistener";
import { Socket } from "./game/helpers/sockets";
import { Turn, TurnPhase } from "../shared/turn.model";
import { messageType } from "../shared/message.model";
import { GameData } from "../shared/gameData.model";
import { Player } from "../shared/player.model";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Create the app with a black background
const app = new Application({
  backgroundColor: 0x000000,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

document.body.appendChild(app.view);

// I dont know yet what these two commands do
const socket = new Socket();
const Listener = new KeyListener();

// Make checkboard
const checkboard = new Container();
const boxes = [];

// Create a 6x8 grid of boxes
const CHECKBOARD_HEIGHT = 6;
const CHECKBOARD_WIDTH = 8;

for (let i = 0; i < CHECKBOARD_WIDTH; i++) {
  boxes.push([]);
  for (let j = 0; j < CHECKBOARD_HEIGHT; j++) {
    const box = new Box();
    box.sprite.x = i * (BLOCK_DIMENSION + PADDING);
    box.sprite.y = j * (BLOCK_DIMENSION + PADDING);
    checkboard.addChild(box.sprite);
    boxes[i].push(box);
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
const player: Player = {
  id: 0,
  isSpectator: true,
};

const gameData: GameData = {
  turn: 0,
  turn_phase: 0,
  positionPawn0: [0,2],
  positionPawn1: [7,3],
  checkboard: Array(CHECKBOARD_WIDTH).fill(Array(CHECKBOARD_HEIGHT).fill(false)),
};

function checkPawnAdjacentBoxes(pawn: Pawn): void {
  for (const pawnAdjacent of pawn.adjacent) {
    const b = boxes[pawnAdjacent[0]][pawnAdjacent[1]];
    b.update(pawn.onMove);
  }
}

function checkPawnMove(pawn: Pawn): number[] {
  let move: number[];
  for (const pawnAdjacent of pawn.adjacent) {
    const b = boxes[pawnAdjacent[0]][pawnAdjacent[1]];
    if (b.move) {
      b.move = false;
      move = pawnAdjacent;
      pawn.onMove = false;
      checkPawnAdjacentBoxes(pawn);
      break;
    }
  }
  return move;
}

function pawnOnMove(pawn: Pawn): void {
  pawn.makePawnInteractive();
  checkPawnAdjacentBoxes(pawn);
  const move = checkPawnMove(pawn); // a vector with the coordinates of the move
  if (move != null) {
    [pawn.x, paw.y] = move;
    pawn.updatePosition();
  }
}

function sendData(): void {
  socket.send({
    type: "input",
    data: "Hello World",
  });
}

socket.connection.onmessage = (signal) => {
  const payload = JSON.parse(signal.data);
  switch (payload.type) {
    case messageType.INIT:
      player.id = payload.data.id;
      player.isSpectator = payload.data.spectator;
      gameData.turn = payload.turn;
      gameData.turn_phase = payload.turn_phase;
      console.log(player.id);
      break;
    case messageType.UPDATE:
      break;
    default:
      break;
  }
};

app.ticker.add((delta) => {
  //console.log("idPlayer: " + idPlayer + "\nturn: " + turn + "\nturn_phase: " + turn_phase + "\nisPlayerSpectator: " + isPlayerSpectator)

  //Move pawn phase
  if (gameData.turn_phase == TurnPhase.MOVE_PAWN) {
    if (player.id == 0 && gameData.turn == Turn.PLAYER_0) {
      pawnOnMove(pawn0);
    }
    else if (player.id == 1 && gameData.turn == Turn.PLAYER_1) {
      pawnOnMove(pawn1);
    }
  }
});
