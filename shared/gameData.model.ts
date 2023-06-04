// @ts-ignore
import { messageType } from "../shared/message.model.ts";
// @ts-ignore
import { Turn, TurnPhase } from "../shared/turn.model.ts";

export interface MultiGameData {
  [key: string]: GameData;
}

export interface MessageData {
  type: messageType;
  timestamp: number;
  gameData: GameData;
}

export interface GameData {
  roomKey: string;
  turn: Turn;
  turnPhase: TurnPhase;
  positionPawn: number[][];
  checkboard: boolean[][];
  winCondition: WinCondition;
}

export const enum WinCondition {
  NO_ONE = 0,
  PLAYER_0_WON = 1,
  PLAYER_1_WON = 2,
}
