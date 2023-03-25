import { WebSocketServer, WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { messageType } from "../../shared/message.model.ts";
import { Player } from "../../shared/player.model.ts";
import { Turn, TurnPhase } from "../../shared/turn.model.ts";
import { createPlayer } from "../player/player.ts";
import { compareId } from "./helper.ts";
import { getInitPlayerMessage } from "./messages.ts";

let turn: Turn = Turn.PLAYER_0;
let turn_phase = TurnPhase.MOVE_PAWN;

export function sendToAllClients(clients: WebSocketClient[], data: string): void {
  for (const client of clients) {
    client.send(data);
  }
}

export function updatePlayerDataOnInput(data: string, players: Player[]): void {
  const message = JSON.parse(data);
  switch (message.type) {
    case messageType.INPUT:
      players[message.data.id] = message.data;
      break;
  }
}

function getAvailableId(players: Player[]): number {
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

export function onConnection(wss: WebSocketServer, ws: WebSocketClient, players: Player[]) {
  const id = getAvailableId(players);
  const player = createPlayer(id);
  players.push(player);

  ws.id = player.id;

  const initMessage = getInitPlayerMessage(player, turn, turn_phase);

  ws.send(initMessage);
  ws.on("message", (data: string) => updatePlayerDataOnInput(data, players));

  // Player leaves, delete data from list
  ws.on("close", () => onClose(wss, ws, players));
}

export function onClose(wss: WebSocketServer, ws: WebSocketClient, players: Player[]) {
  const index = players.findIndex((p) => p.id === ws.id);
  if (index !== -1) {
    players.splice(index, 1);
  }

  ws.close();
  wss.clients.delete(ws);
}
