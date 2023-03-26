import { WebSocketServer, WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { messageType } from "../../shared/message.model.ts";
import { Player } from "../../shared/player.model.ts";
import { Turn, TurnPhase } from "../../shared/turn.model.ts";
import { createPlayer } from "../player/player.ts";
import { compareId } from "./helper.ts";
import { getInitPlayerMessage } from "./messages.ts";

let turn: Turn = Turn.PLAYER_0;
let turnPhase = TurnPhase.MOVE_PAWN;

export function sendToAllClients(clients: WebSocketClient[], data: string): void {
  for (const client of clients) {
    client.send(data);
  }
}

export function getGameDataOnInput(data: string): GameData {
  const message = JSON.parse(data);
  switch (message.type) {
    case messageType.GAME_DATA:
      return message.gameData;
    default:
      break;
  }
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
