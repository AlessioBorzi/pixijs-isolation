import { messageType } from "../../shared/message.model.ts";
import { Player } from "../../shared/player.model.ts";
import { Turn, TurnPhase } from '../../shared/turn.model.ts';

export function getPlayersDataMessage(data: Player[]): string {
  return JSON.stringify({
    type: messageType.UPDATE,
    timestamp: Date.now(),
    data,
  });
}

export function getInitPlayerMessage(data: Player, turn: Turn, turnPhase: TurnPhase): string {
  return JSON.stringify({
    type: messageType.INIT,
    timestamp: Date.now(),
    data,
    turn,
    turnPhase,
  });
}
