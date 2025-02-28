import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { CACHED_TAGS } from "../../../../constants/tags";
import { FormateDateDDMM } from "../../../../utils/formatting";
import {
  DashboardGraphPoints,
  ReferencePoints,
} from "../../../../validations/generic/types";
import { GameSchemaType } from "../../../../validations/pb/types";
import { RoundsVsDateGraph } from "./graph.client";

export default async function GamesGraph({
  gameData,
  maxDate,
  userID,
}: {
  gameData: GameSchemaType[];
  maxDate: Date;
  userID: string;
}) {
  const { points, maxNumberOfGamesPlayed } = await unstable_cache(
    async (games: GameSchemaType[], latestDate: Date) => {
      const mergedDataMap = new Map<string, DashboardGraphPoints>();

      games.forEach((data) => {
        const date = FormateDateDDMM(new Date(data.created));
        if (mergedDataMap.has(date)) {
          const existingData = mergedDataMap.get(date)!;
          existingData.y = (Number.parseInt(existingData.y) + 1).toString();
        } else {
          mergedDataMap.set(date, {
            x: date,
            y: "1",
          });
        }
      });

      let graphData = Array.from(mergedDataMap.values());

      graphData.sort(
        (a, b) => new Date(b.x).getTime() - new Date(a.x).getTime(),
      );

      for (let i = 0; i < 7; i++) {
        const date = new Date(latestDate);
        date.setDate(date.getDate() - i);

        const formattedDate = FormateDateDDMM(date);
        if (!mergedDataMap.has(formattedDate)) {
          graphData.push({
            x: formattedDate,
            y: "0",
          });
        }
      }

      graphData.sort((a, b) => {
        const dateA = new Date();

        dateA.setDate(Number.parseInt(a.x.split("/")[0]));
        dateA.setMonth(Number.parseInt(a.x.split("/")[1]) - 1);

        const dateB = new Date();
        dateB.setDate(Number.parseInt(b.x.split("/")[0]));
        dateB.setMonth(Number.parseInt(b.x.split("/")[1]) - 1);

        if (dateA.getTime() > dateB.getTime()) {
          return 1;
        }
        if (dateA.getTime() < dateB.getTime()) {
          return -1;
        }
        return 0;
      });

      graphData = graphData.slice(0, 7);
      const monthsSet = new Set<string>();
      graphData.forEach((data) => {
        if (monthsSet.has(data.x.split("/")[1])) {
          return;
        }
        monthsSet.add(data.x.split("/")[1]);
      });

      if (monthsSet.size === 1) {
        graphData.forEach((data) => {
          data.x = data.x.split("/")[0];
        });
      }

      const maxNumberOfGamesPlayed = {
        value: Math.max(...graphData.map((data) => Number(data.y))),
        key: graphData[graphData.length - 1].x,
      } as ReferencePoints;

      return {
        points: graphData,
        maxNumberOfGamesPlayed,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
    },
  )(gameData, maxDate);

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-red-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <RoundsVsDateGraph
        data={points}
        maxNumberOfGamesPlayed={maxNumberOfGamesPlayed}
      />
    </div>
  );
}

export function FallbackGamesGraph() {
  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-red-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
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
