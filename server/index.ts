import { join } from 'https://deno.land/std@0.149.0/path/posix.ts';
import { resolve } from 'https://deno.land/std@0.179.0/path/mod.ts';
import { WebSocketClient, WebSocketServer } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';
import { fromMeta } from 'https://x.nest.land/dirname_deno@0.3.0/mod.ts';
import express from 'npm:express@4.18.2';
const { __dirname } = fromMeta(import.meta);

const app = express();
const wss = new WebSocketServer(3010);

app.get('/', (req, res) => {
  res.sendFile(resolve('dist/index.html'));
});

app.use('/', express.static(join(__dirname, '../dist')));

// setup
const PORT = 3000;
const HOST = '127.0.0.1';

// Turn management
const enum TURN {
  PLAYER_0 = false,
  PLAYER_1 = true,
};
const enum TURN_PHASE {
  MOVE_PAWN = false,
  REMOVE_BOX = true,
};
let turn: Turn = TURN.PLAYER_0;
let turn_phase = TURN_PHASE.MOVE_PAWN;

// Players data
const players = [];

function createPlayer() {
  const l = players.length;
  const player = {
    id: l,
    spectator: (l > 1),
  };
  players.push(player);
  return player;
}

function getPlayersData() {
  return JSON.stringify({
    type: 'update',
    timestamp: Date.now(),
    data: players,
  });
}

setInterval(() => {
  const data = getPlayersData();
  for (const client of wss.clients) {
    client.send(data);
  }
}, 100);

function getDataFromClient(data: string) {
  const message = JSON.parse(data);
  switch (message.type) {
    case 'input':
      players[message.data.id] = message.data;
      break;
  }
}

function onConnection(ws: WebSocketClient) {
  const player = createPlayer();
  ws.id = player.id;
  const initMessage: string = JSON.stringify({
      type: 'init',
      timestamp: Date.now(),
      data: player,
  });
  ws.send(initMessage);
  ws.on('message', getDataFromClient);
  //Player leaves, delete data from list
  ws.on('close', () => {delete players[ws.id];});
}

wss.on('connection', onConnection);

app.listen(PORT);

console.log('Server running at ' + HOST + ':' + PORT + '/');
