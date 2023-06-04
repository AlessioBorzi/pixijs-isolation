import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { CHECKBOARD_HEIGHT, CHECKBOARD_WIDTH } from "../../shared/checkboard.model.ts";
import { GameData, MessageData, WinCondition } from "../../shared/gameData.model.ts";
import { generateRandomKey } from "../../shared/helper.ts";
import { Player } from "../../shared/player.model.ts";
import { Turn, TurnPhase } from "../../shared/turn.model.ts";
import { compareId } from "./helper.ts";

export function sendToAllClients(clients: WebSocketClient[], data: string): void {
  for (const client of clients) {
    client.send(data);
  }
}

export function getDataOnInput(data: string): MessageData {
  const message = JSON.parse(data);
  return message;
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
    roomKey: "",
    turn: Turn.PLAYER_0,
    turnPhase: TurnPhase.MOVE_PAWN,
    positionPawn: [
      [0, 2],
      [7, 3],
    ],
    checkboard: Array(CHECKBOARD_HEIGHT).fill(Array(CHECKBOARD_WIDTH).fill(false)),
    winCondition: WinCondition.NO_ONE,
  };
}

export function generatePartyKey(partyKeys: string[]): string {
  let key = generateRandomKey();

  while (partyKeys.includes(key)) {
    // while key already exists
    key = generateRandomKey();
  }

  return key;
}

// TODO: delete roomKey after 2 hours (check GameData timestamp)
