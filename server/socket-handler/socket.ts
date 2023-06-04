import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { GameData, MultiGameData } from "../../shared/gameData.model.ts";
import { messageType } from "../../shared/message.model.ts";
import { Player } from "../../shared/player.model.ts";
import { createPlayer } from "../player/player.ts";
import { generatePartyKey, getAvailableId, getDataOnInput, initGameData, onClose, sendToAllClients } from "./communication.ts";
import { getGameDataMessage, getInitPlayerMessage, getPlayersMessage } from "./messages.ts";

// Global variables
const players: Player[] = [];
const multiGameData: MultiGameData = {
  test: initGameData(), // TODO
};

const wss: WebSocketServer = new WebSocketServer(3010);

setInterval(() => {
  const playersMessage = getPlayersMessage(players);
  sendToAllClients(wss.clients, playersMessage);
}, 100);

function onClientMessage(wss: WebSocketServer, data: string): void {
  // "test" =  generatePartyKey()
  const messageData = getDataOnInput(data);
  multiGameData["test"] = messageData.gameData;

  const gameDataMessage = getGameDataMessage(multiGameData["test"]);
  sendToAllClients(wss.clients, gameDataMessage);
  console.log("TYPE: ", messageData.type);
  switch (messageData.type) {
    case messageType.CREATE_PARTY:
      console.log("PARTY: ", multiGameData["test"]);
      const currentPartyKeys = Object.keys(multiGameData).map((key) => multiGameData[key].roomKey);
      const newRoomKey = generatePartyKey(currentPartyKeys);
      multiGameData[newRoomKey] = {} as GameData;
      console.log("newRoomKey", newRoomKey);
      console.log("multiGameData", multiGameData);
      break;
  }
}

function onConnection(wss: WebSocketServer, ws: WebSocketClient, players: Player[]): void {
  // Create New Player
  const id = getAvailableId(players);
  const player = createPlayer(id);
  players.push(player);
  ws.id = player.id;
  // console.log(players);

  // Send init data to client
  const initMessage = getInitPlayerMessage(player, multiGameData["test"]); // TODO
  ws.send(initMessage);

  ws.on("message", (data) => onClientMessage(wss, data));

  // Player leaves, delete data from list
  ws.on("close", () => onClose(wss, ws, players));
}

wss.on("connection", (ws: WebSocketClient) => onConnection(wss, ws, players));
