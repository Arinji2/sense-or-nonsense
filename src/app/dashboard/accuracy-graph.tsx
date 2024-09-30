import { Loader2 } from "lucide-react";
import { AccuracyVsDifficultyGraphPoints } from "../../../validations/generic/types";
import { GameSchemaType, RoundSchemaType } from "../../../validations/pb/types";
import { AccuracyVsDifficulty } from "./graph.client";

export default async function AccuracyGraph({
  gameData,
  roundsData,
  userID,
}: {
  gameData: GameSchemaType[];
  roundsData: RoundSchemaType[];

  userID: string;
}) {
  const difficultyAccuracyMap = new Map<string, number>();
  gameData.forEach((game) => {
    if (difficultyAccuracyMap.has(game.difficulty)) {
      const existingAccuracy = difficultyAccuracyMap.get(game.difficulty)!;
      const roundsForGame = roundsData.filter(
        (round) => round.game === game.id,
      );
      if (roundsForGame.length === 0) {
        return;
      }
      const accuracy =
        roundsForGame.filter((round) => round.correct).length /
        roundsForGame.length;
      difficultyAccuracyMap.set(game.difficulty, existingAccuracy + accuracy);
    } else {
      const roundsForGame = roundsData.filter(
        (round) => round.game === game.id,
      );
      if (roundsForGame.length === 0) {
        return;
      }
      const accuracy =
        roundsForGame.filter((round) => round.correct).length /
        roundsForGame.length;
      difficultyAccuracyMap.set(game.difficulty, accuracy);
    }
  });

  console.log(difficultyAccuracyMap);

  const graph = Array.from(difficultyAccuracyMap.entries()).map(
    ([difficulty, accuracy]) => {
      return {
        x: difficulty,
        y: accuracy.toFixed(2),
      };
    },
  ) as any as AccuracyVsDifficultyGraphPoints[];

  const maxAccuracy = Math.max(...graph.map((data) => Number(data.y)));

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-green-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <AccuracyVsDifficulty data={graph} maxAccuracy={maxAccuracy} />
    </div>
  );
}

export function FallbackAccuracyGraph() {
  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-green-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <p className="text-center text-base font-bold tracking-title text-white md:text-xl xl:text-2xl">
        LOADING
      </p>
      <Loader2
        strokeWidth={3}
        className="size-8 animate-spin text-white md:size-10"
      />
    </div>
  );
}
