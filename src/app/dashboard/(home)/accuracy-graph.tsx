import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { CACHED_TAGS } from "../../../../constants/tags";
import {
  GameSchemaType,
  RoundSchemaType,
} from "../../../../validations/pb/types";
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
  const { points, maxAccuracy } = await unstable_cache(
    async (games: GameSchemaType[], rounds: RoundSchemaType[]) => {
      const difficultyAccuracyMap = new Map();
      games.forEach((game) => {
        const roundsForGame = rounds.filter((round) => round.game === game.id);
        if (roundsForGame.length === 0) {
          return;
        }
        const accuracy =
          roundsForGame.filter((round) => round.correct).length /
          roundsForGame.length;

        if (difficultyAccuracyMap.has(game.difficulty)) {
          const existingAccuracy = difficultyAccuracyMap.get(game.difficulty);
          difficultyAccuracyMap.set(
            game.difficulty,
            existingAccuracy + accuracy,
          );
        } else {
          difficultyAccuracyMap.set(game.difficulty, accuracy);
        }
      });

      const graph = Array.from(difficultyAccuracyMap.entries()).map(
        ([difficulty, accuracy]) => ({
          x: difficulty,
          y: accuracy.toFixed(2),
        }),
      );

      const maxAccuracy = {
        value: Math.max(...graph.map((data) => Number(data.y))),
        key: graph[graph.length - 1].x,
      };

      return {
        points: graph,
        maxAccuracy,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
    },
  )(gameData, roundsData);

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-green-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <AccuracyVsDifficulty data={points} maxAccuracy={maxAccuracy} />
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
