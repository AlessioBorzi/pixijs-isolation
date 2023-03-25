import { Turn, TurnPhase } from './turn.model';

export interface GameData {
  turn: Turn;
  turn_phase: TurnPhase;
  positionPawn0: number[];
  positionPawn1: number[];
  checkboard: boolean[][];
}
