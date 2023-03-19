import { join } from "https://deno.land/std@0.149.0/path/posix.ts";
import { resolve } from "https://deno.land/std@0.179.0/path/mod.ts";
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { fromMeta } from "https://x.nest.land/dirname_deno@0.3.0/mod.ts";
import express from "npm:express@4.18.2";
const { __dirname } = fromMeta(import.meta);

const app = express();
const wss = new WebSocketServer(3010);

app.get("/", (req, res) => {
  res.sendFile(resolve("index.html"));
});

app.use("/static", express.static(join(__dirname, "../app")));

// setup
const PORT = 3000;
const HOST = "127.0.0.1";

// Holds the players inputs
const playersData = {
  players: {},
};

function getPlayersData() {
  return JSON.stringify({
    type: "update",
    timestamp: Date.now(),
    data: Array.from(Object.values(playersData.players)),
  });
}

function createPlayer() {
  const player = {
    id: Math.random().toString(36).substring(7),
    x: 100,
    y: 100,
  };
  playersData.players[player.id] = player;
  return player;
}

setInterval(() => {
  const data = getPlayersData();
  for (const client of wss.clients) {
    client.send(data);
  }
}, 100);

wss.on("connection", (ws: WebSocketClient) => {
  const player = createPlayer();
  ws.id = player.id;
  ws.send(
    JSON.stringify({
      type: "init",
      timestamp: Date.now(),
      data: player,
    })
  );
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case "input":
        playersData.players[message.data.id] = message.data;
        break;
    }
  });
  //Player leaves, delete data from list
  ws.on("close", () => {
    delete playersData.players[ws.id];
  });
});

app.listen(PORT);

console.log("Server running at " + HOST + ":" + PORT + "/");
