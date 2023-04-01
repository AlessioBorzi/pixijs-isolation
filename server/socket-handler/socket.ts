import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { CHECKBOARD_HEIGHT, CHECKBOARD_WIDTH } from "../../shared/checkboard.model.ts";
import { GameData, WinCondition } from "../../shared/gameData.model.ts";
import { Player } from "../../shared/player.model.ts";
import { Turn, TurnPhase } from "../../shared/turn.model.ts";
import { createPlayer } from "../player/player.ts";
import { getAvailableId, getGameDataOnInput, onClose, onConnection, sendToAllClients } from "./communication.ts";
import { getGameDataMessage, getInitPlayerMessage, getPlayersMessage } from "./messages.ts";

// Global variables
const players: Player[] = [];
let gameData: GameData = {
  turn: Turn.PLAYER_0,
  turnPhase: TurnPhase.MOVE_PAWN,
  positionPawn: [
    [0, 2],
    [7, 3],
  ],
  checkboard: Array(CHECKBOARD_HEIGHT).fill(Array(CHECKBOARD_WIDTH).fill(false)),
  winCondition: WinCondition.FALSE,
};

const wss: WebSocketServer = new WebSocketServer(3010);

setInterval(() => {
  const playersMessage = getPlayersMessage(players);
  sendToAllClients(wss.clients, playersMessage);
}, 100);

function onClientMessage(wss: WebSocketServer, data: string): void {
  gameData = getGameDataOnInput(data);
  const gameDataMessage = getGameDataMessage(gameData);
  sendToAllClients(wss.clients, gameDataMessage);
  // console.log(gameData);
}

function onConnection(wss: WebSocketServer, ws: WebSocketClient, players: Player[]): void {
  // Create New Player
  const id = getAvailableId(players);
  const player = createPlayer(id);
  players.push(player);
  ws.id = player.id;
  // console.log(players);

  // Send init data to client
  const initMessage = getInitPlayerMessage(player, gameData);
  ws.send(initMessage);

  ws.on("message", (data) => onClientMessage(wss, data));

  // Player leaves, delete data from list
  ws.on("close", () => onClose(wss, ws, players));
}

wss.on("connection", (ws: WebSocketClient) => onConnection(wss, ws, players));
