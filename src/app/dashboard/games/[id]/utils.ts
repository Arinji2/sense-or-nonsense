import { GameFighterSchemaType } from "../../../../../validations/game-data/types";
import {
  SummaryData,
  SummaryGraphPoints,
} from "../../../../../validations/generic/types";
import { RoundSchemaType } from "../../../../../validations/pb/types";

export function GetPlayerGraphs(
  playerData: GameFighterSchemaType[],
  rounds: RoundSchemaType[],
) {
  const players: SummaryData[] = [];
  playerData.forEach((_, index) => {
    let playerData = {
      correct: 0,
      incorrect: 0,
      timePlayed: 0,
      graphPoints: [] as SummaryGraphPoints[],
      maxAccuracy: 0,
      maxTimeLeft: 0,
      minTimeLeft: Infinity as number,
      maxStreak: {
        value: 0,
        round: 0,
      },
    };
    let playerStreak = 0;

    rounds.forEach((round) => {
      if (round.player_index !== index) return;

      let localStreak = playerStreak;

      if (round.correct) {
        playerData.correct += 1;
        localStreak = playerStreak + 1;
      } else {
        playerData.incorrect += 1;
        localStreak = 0;
      }

      const timeTakenForRound = 10 - round.time_elapsed;

      playerData.timePlayed += round.time_elapsed;

      playerData.graphPoints.push({
        x: round.round_number,
        y: timeTakenForRound,
        accuracy: Math.round(
          (playerData.correct / (playerData.correct + playerData.incorrect)) *
            100,
        ),
      });

      playerData.maxTimeLeft = Math.max(
        playerData.maxTimeLeft,
        timeTakenForRound,
      );

      playerData.minTimeLeft = Math.min(
        playerData.minTimeLeft,
        timeTakenForRound,
      );

      const localMaxStreak = Math.max(playerData.maxStreak.value, localStreak);

      if (localMaxStreak !== playerData.maxStreak.value) {
        playerData.maxStreak.value = localMaxStreak;
        playerData.maxStreak.round = round.round_number;
      }

      playerStreak = localStreak;
    });

    playerData.maxAccuracy = Math.max(
      playerData.maxAccuracy,
      ...playerData.graphPoints.map((point) => point.accuracy),
    );

    if (playerData.minTimeLeft === Infinity) playerData.minTimeLeft = 0;

    players.push(playerData as SummaryData);
  });

  return players;
}
