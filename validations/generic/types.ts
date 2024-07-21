export type COOPSupportForFighterSelect = {
  supported: boolean;
  currentPlayer: number;
};
export type BackdropSelected = {
  verified: boolean;
  id: number;
};
export type CurrentGameStreaks =
  | number
  | {
      player1: number;
      player2: number;
      currentPlayer: number;
    };
