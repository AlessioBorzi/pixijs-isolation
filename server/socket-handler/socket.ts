import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { Player } from "../../shared/player.model.ts";
import { onConnection, sendToAllClients } from "./communication.ts";
import { getPlayersDataMessage } from "./messages.ts";

// Players data
const players: Player[] = [];

const wss: WebSocketServer = new WebSocketServer(3010);

setInterval(() => {
  const data = getPlayersDataMessage(players);
  sendToAllClients(wss.clients, data);
}, 100);

wss.on("connection", (ws: WebSocketClient) => onConnection(wss, ws, players));
