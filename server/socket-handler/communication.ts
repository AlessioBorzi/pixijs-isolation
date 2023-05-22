import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { GameData } from "../../shared/gameData.model.ts";
import { Player } from "../../shared/player.model.ts";
import { compareId } from "./helper.ts";
import { CHECKBOARD_HEIGHT, CHECKBOARD_WIDTH } from "../../shared/checkboard.model.ts";
import { Turn, TurnPhase } from "../../shared/turn.model.ts";
import { MultiGameData } from "../../shared/gameData.model.ts";
import { generateRandomKey } from "../../shared/helper.ts";

export function sendToAllClients(clients: WebSocketClient[], data: string): void {
  for (const client of clients) {
    client.send(data);
  }
}

export function getGameDataOnInput(data: string): GameData {
  const message = JSON.parse(data);
  return message.gameData;
}

export function getAvailableId(players: Player[]): number {
  let id = 0;
  players.sort(compareId);
  for (const player of players) {
    if (id === player.id) {
      id++;
    } else {
      return id;
    }
  }

  return id;
}

export function onClose(wss: WebSocketServer, ws: WebSocketClient, players: Player[]) {
  const index = players.findIndex((p) => p.id === ws.id);
  if (index !== -1) {
    players.splice(index, 1);
  }

  ws.close();
  wss.clients.delete(ws);
}

export function initGameData(): GameData {
  return {
    turn: Turn.PLAYER_0,
    turnPhase: TurnPhase.MOVE_PAWN,
    positionPawn: [
      [0, 2],
      [7, 3],
    ],
    checkboard: Array(CHECKBOARD_HEIGHT).fill(Array(CHECKBOARD_WIDTH).fill(false)),
  };
}

export function generatePartyKey(multiGameData: MultiGameData): string {
  let key = generateRandomKey();

  while (key in multiGameData) {
    // while key already exists
    key = generateRandomKey();
  }

  return key;
}
