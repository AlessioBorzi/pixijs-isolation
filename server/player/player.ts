import { Player } from '../../shared/player.model.ts';

export function createPlayer(id: number): Player {
  const player: Player = {
    id,
    spectator: id > 1,
  };
  return player;
}
