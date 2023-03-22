import { WebSocketClient, WebSocketServer } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';
import { Player } from '../../shared/player.model.ts';
import { createPlayer } from '../player/player.ts';
import { messageType } from '../../shared/message.model.ts';
import { getInitPlayerMessage, getPlayersDataMessage } from './messages.ts';

function sendToAllClients(clients, data: string): void {
  for (const client of clients) {
    client.send(data);
  }
}

function updatePlayerDataOnInput(data: string): void {
  const message = JSON.parse(data);
  switch (message.type) {
    case messageType.INPUT:
      players[message.data.id] = message.data;
      break;
  }
}

function onConnection(ws: WebSocketClient, players: Player[]): void {
  const player = createPlayer(players.length);
  players.push(player);

  ws.id = player.id;

  const initMessage = getInitPlayerMessage(player);

  ws.send(initMessage);
  ws.on('message', updatePlayerDataOnInput);

  // Player leaves, delete data from list
  ws.on('close', () => {
    delete players[ws.id];
  });
}

export function initSocketConnection(): void {
  const wss = new WebSocketServer(3010);

  // Holds the players inputs
  const players: Player[] = [];

  setInterval(() => {
    const data = getPlayersDataMessage(players);
    sendToAllClients(wss.clients, data);
  }, 100);

  wss.on('connection', onConnection);
}
