// @ts-ignore
import { Turn, TurnPhase } from "./turn.model.ts";

export interface MultiGameData {
  [key: string]: GameData;
}

export interface GameData {
  turn: Turn;
  turnPhase: TurnPhase;
  positionPawn: number[][];
  checkboard: boolean[][];
}
