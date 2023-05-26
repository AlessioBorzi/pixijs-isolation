import "./css/style.css";

import { Application, Container, Text, TextStyle, Graphics } from "pixi.js";
import { CHECKBOARD_HEIGHT, CHECKBOARD_WIDTH } from "../shared/checkboard.model";
import { GameData, WinCondition } from "../shared/gameData.model";
import { messageType } from "../shared/message.model";
import { Player } from "../shared/player.model";
import { Turn, TurnPhase } from "../shared/turn.model";
import { BLOCK_DIMENSION, Box, PADDING } from "./game/models/box";
import { Pawn } from "./game/models/pawn";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Create the app with a black background
const app = new Application({
  backgroundColor: 0x000000,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

document.body.appendChild(app.view);

// WebSocket
const ws = new WebSocket(`ws://${window.location.hostname}:3010`);

// Make checkboard
const checkboard = new Container();
const boxes = [];

// Create a 6x8 grid of boxes
for (let i = 0; i < CHECKBOARD_HEIGHT; i++) {
  boxes.push([]);
  for (let j = 0; j < CHECKBOARD_WIDTH; j++) {
    const box = new Box();
    box.sprite.x = j * (BLOCK_DIMENSION + PADDING);
    box.sprite.y = i * (BLOCK_DIMENSION + PADDING);
    checkboard.addChild(box.sprite);
    boxes[i].push(box);
  }
}

// Make the two pawns
const pawns = [new Pawn(false), new Pawn(true)];
checkboard.addChild(pawns[0].sprite);
checkboard.addChild(pawns[1].sprite);

// Move checkerboard to the center
checkboard.x = app.screen.width / 2;
checkboard.y = app.screen.height / 2;
// Center box sprite in local container coordinates
checkboard.pivot.x = checkboard.width / 2;
checkboard.pivot.y = checkboard.height / 2;

app.stage.addChild(checkboard);

// Client
let player: Player;
let gameData: GameData;

// Move Pawn Phase

function checkPawnAdjacentBoxes(pawn: Pawn, waitForMove: boolean): void {
  for (const pawnAdjacent of pawn.adjacent) {
    const b = boxes[pawnAdjacent[1]][pawnAdjacent[0]];
    if (!b.removed && !equalArray(pawnAdjacent, gameData.positionPawn[0]) && !equalArray(pawnAdjacent, gameData.positionPawn[1])) {
      b.waitForMove = waitForMove;
      b.update(pawn.onMove);
    }
  }
}

function checkPawnMove(pawn: Pawn): number[] {
  let move: number[];
  for (const pawnAdjacent of pawn.adjacent) {
    const b = boxes[pawnAdjacent[1]][pawnAdjacent[0]];
    if (b.move) {
      b.move = false;
      move = pawnAdjacent;
      pawn.onMove = false;
      checkPawnAdjacentBoxes(pawn, false);
      break;
    }
  }
  return move;
}

function movePhase(i: number): void {
  const pawn = pawns[i];
  pawn.makePawnInteractive(true);
  checkPawnAdjacentBoxes(pawn, true);
  const move = checkPawnMove(pawn); // a vector with the coordinates of the move
  if (move != null) {
    [pawn.x, pawn.y] = gameData.positionPawn[i] = move;
    pawn.updatePosition();
    gameData.turnPhase = TurnPhase.REMOVE_BOX;
    sendGameData(gameData);
  }
}

// Remove Box Phase

function equalArray(a: number[], b: number[]): boolean {
  return a.every((value, index) => value === b[index]);
}

function makeAllBoxesInteractive(interactive: boolean): void {
  for (let i = 0; i < CHECKBOARD_WIDTH; i++) {
    for (let j = 0; j < CHECKBOARD_HEIGHT; j++) {
      const b = boxes[j][i];
      const a = [i, j];
      if (!(equalArray(a, gameData.positionPawn[0]) || equalArray(a, gameData.positionPawn[1]))) {
        b.update(interactive);
      }
    }
  }
}

function checkBoxRemoved(): void {
  for (let i = 0; i < CHECKBOARD_WIDTH; i++) {
    for (let j = 0; j < CHECKBOARD_HEIGHT; j++) {
      const b = boxes[j][i];
      if (b.justRemoved) {
        b.justRemoved = false;
        gameData.checkboard[j][i] = true;
        makeAllBoxesInteractive(false);
        gameData.turnPhase = TurnPhase.MOVE_PAWN;
        gameData.turn = Number(!gameData.turn);
        sendGameData(gameData);
        return;
      }
    }
  }
}

function removeBoxPhase(i: number): void {
  const pawn = pawns[i];
  pawn.makePawnInteractive(false);
  makeAllBoxesInteractive(true);
  checkBoxRemoved();
}

function updateCheckboard(gameData: GameData): void {
  for (const i of [0, 1]) {
    const pawn = pawns[i];
    [pawn.x, pawn.y] = gameData.positionPawn[i];
    pawn.updatePosition();
  }
  for (let i = 0; i < CHECKBOARD_WIDTH; i++) {
    for (let j = 0; j < CHECKBOARD_HEIGHT; j++) {
      const b = boxes[j][i];
      b.removed = gameData.checkboard[j][i];
      b.update(b.sprite.interactive);
    }
  }
}

function sendGameData(gameData: GameData): void {
  console.log("I am sending a message to the server");
  ws.send(
    JSON.stringify({
      type: messageType.GAME_DATA,
      timestamp: Date.now(),
      gameData,
    }),
  );
}

function createParty(): void {
  console.log("I am sending a message to the server requesting a party room");
  ws.send(
    JSON.stringify({
      type: messageType.CREATE_PARTY,
      timestamp: Date.now(),
      gameData,
    }),
  );
}

// Win condition

function canPawnMove(pawn: Pawn): boolean {
  if (gameData?.positionPawn != undefined) {
    for (const pawnAdjacent of pawn.adjacent) {
      const b = boxes[pawnAdjacent[1]][pawnAdjacent[0]];
      if (!b.removed && !equalArray(pawnAdjacent, gameData.positionPawn[0]) && !equalArray(pawnAdjacent, gameData.positionPawn[1])) {
        return true;
      }
    }

    return false;
  }

  return true;
}

function getWinCondition(): WinCondition {
  if (!canPawnMove(pawns[0]) && gameData.turn === Turn.PLAYER_0) {
    return WinCondition.PLAYER_1_WON;
  }

  if (!canPawnMove(pawns[1]) && gameData.turn === Turn.PLAYER_1) {
    return WinCondition.PLAYER_0_WON;
  }

  return WinCondition.NO_ONE;
}

function winMenu(winCondition: WinCondition): void {
  if (winCondition != WinCondition.NO_ONE) {
    // Create text "Player x won"
    const playerWonText = new Text("");

    if (winCondition == WinCondition.PLAYER_0_WON) {
      playerWonText.text = "Player 1 won!";
    } else {
      playerWonText.text = "Player 2 won!";
    }

    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 64,
      // fontStyle: 'italic',
      fontWeight: "bold",
      fill: ["#ffffff"],
      stroke: "#4a1850",
      strokeThickness: 3,
    });

    playerWonText.style = textStyle;
    playerWonText.x = app.screen.width / 2;
    playerWonText.y = app.screen.height / 2;
    playerWonText.pivot.x = playerWonText.x / 2;
    playerWonText.pivot.y = playerWonText.y / 2;

    // Create button "New game"
    //const newGameButton =

    const greyBackground = new Graphics();
    greyBackground.beginFill(0xbbbbbb, 0.8);
    greyBackground.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    greyBackground.endFill();

    app.stage.addChild(greyBackground);
    app.stage.addChild(playerWonText);
  }
}

ws.onmessage = (signal: MessageEvent<string>) => {
  const message = JSON.parse(signal.data);
  switch (message.type) {
    case messageType.INIT:
      player = message.player;
      gameData = message.gameData;
      updateCheckboard(gameData);
      console.log("Player id: " + player.id);
      break;
    case messageType.GAME_DATA:
      gameData = message.gameData;
      updateCheckboard(gameData);
      break;
    case messageType.PLAYERS:
    case messageType.CREATE_PARTY:
      break;
    case messageType.PARTY_KEY:
      break;
    default:
      break;
  }
};

app.ticker.add(() => {
  //console.log("idPlayer: " + idPlayer + "\nturn: " + turn + "\nturnPhase: " + turnPhase + "\nisPlayerSpectator: " + isPlayerSpectator)

  const winCondition = getWinCondition();
  winMenu(winCondition);
  if (winCondition == WinCondition.PLAYER_0_WON) {
    // Player 0 won
    console.log("Player 1 won");
  } else if (winCondition == WinCondition.PLAYER_1_WON) {
    // Player 1 won
    console.log("Player 2 won");
  }

  const isFirstPlayerTurn = player?.id === 0 && gameData.turn === Turn.PLAYER_0;
  const isSecondPlayerTurn = player?.id === 1 && gameData.turn === Turn.PLAYER_1;

  if (isFirstPlayerTurn || isSecondPlayerTurn) {
    const playerIndex = isFirstPlayerTurn ? 0 : 1;

    if (gameData.turnPhase === TurnPhase.MOVE_PAWN) {
      movePhase(playerIndex);
    } else if (gameData.turnPhase === TurnPhase.REMOVE_BOX) {
      removeBoxPhase(playerIndex);
    }
  }
});
