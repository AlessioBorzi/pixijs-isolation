import { GameData, MultiGameData } from "../../shared/gameData.model.ts";
import { messageType } from "../../shared/message.model.ts";
import { Player } from "../../shared/player.model.ts";
import { generatePartyKey } from "./communication.ts";

export function getInitPlayerMessage(player: Player, gameData: GameData): string {
  return JSON.stringify({
    type: messageType.INIT,
    timestamp: Date.now(),
    player,
    gameData,
  });
}

export function getGameDataMessage(gameData: GameData): string {
  return JSON.stringify({
    type: messageType.GAME_DATA,
    timestamp: Date.now(),
    gameData,
  });
}

export function getPlayersMessage(data: Player[]): string {
  return JSON.stringify({
    type: messageType.PLAYERS,
    timestamp: Date.now(),
    data,
  });
}

export function getNewPartyKey(partyKeys: string[]): string {
  return JSON.stringify({
    type: messageType.PARTY_KEY,
    timestamp: Date.now(),
    data: generatePartyKey(partyKeys),
  });
}
