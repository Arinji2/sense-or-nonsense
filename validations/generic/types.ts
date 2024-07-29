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

export type SummaryGraphPoints = {
  x: number;
  y: number;

  accuracy: number;
};

export type MaxStreakDataType = {
  value: number;
  round: number;
};

export type SummaryData = {
  correct: number;
  incorrect: number;
  timePlayed: number;
  maxStreak: MaxStreakDataType;
  graphPoints: SummaryGraphPoints[];
  maxAccuracy: number;
  maxTimeLeft: number;
  minTimeLeft: number;
};

export type StringSearchParamType = string | string[] | undefined;
