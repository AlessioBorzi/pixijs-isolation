import { Turn, TurnPhase } from './turn.model';

export interface GameData {
  turn: Turn;
  turnPhase: TurnPhase;
  positionPawn: number[][];
  checkboard: boolean[][];
}
