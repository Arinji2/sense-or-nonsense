import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { CACHED_TAGS } from "../../../../constants/tags";
import { DashboardGraphPoints } from "../../../../validations/generic/types";
import {
  GameSchemaType,
  RoundSchemaType,
} from "../../../../validations/pb/types";
import { MaxTimeVsDifficulty } from "./graph.client";

export default async function TimeGraph({
  gameData,
  roundsData,
  userID,
}: {
  gameData: GameSchemaType[];
  roundsData: RoundSchemaType[];

  userID: string;
}) {
  const { points, maxTimeTaken } = await unstable_cache(
    async (games: GameSchemaType[], rounds: RoundSchemaType[]) => {
      const maxTimeDifficultyMap = new Map<string, number>();
      games.forEach((game) => {
        const roundsForGame = rounds.filter((round) => round.game === game.id);
        if (roundsForGame.length === 0) {
          return;
        }

        const maxTimeTaken = Math.max(
          ...roundsForGame.map((round) => round.time_elapsed),
        );

        if (maxTimeDifficultyMap.has(game.difficulty)) {
          const existingTimeTaken = maxTimeDifficultyMap.get(game.difficulty);
          maxTimeDifficultyMap.set(
            game.difficulty,
            Math.max(existingTimeTaken!, maxTimeTaken),
          );
        } else {
          maxTimeDifficultyMap.set(game.difficulty, maxTimeTaken);
        }
      });

      const graph = Array.from(maxTimeDifficultyMap.entries()).map(
        ([difficulty, maxTimeTaken]) => ({
          x: difficulty,
          y: Math.round(maxTimeTaken),
        }),
      );

      if (graph.length === 0) {
        return {
          points: [] as any as DashboardGraphPoints[],
          maxTimeTaken: {
            value: 0,
            key: "0",
          },
        };
      }

      const maxTimeTaken = {
        value: Math.max(...graph.map((data) => Number(data.y))),
        key: graph[graph.length - 1].x,
      };

      return {
        points: graph as any as DashboardGraphPoints[],
        maxTimeTaken,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
    },
  )(gameData, roundsData);

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-yellow-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <MaxTimeVsDifficulty data={points} maxTimeTaken={maxTimeTaken} />
    </div>
  );
}

export function FallbackTimeGraph() {
  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-yellow-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
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
