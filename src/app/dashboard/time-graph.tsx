import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { FormateDateDDMM } from "../../../utils/formatting";
import {
  DashboardGraphPoints,
  ReferencePoints,
} from "../../../validations/generic/types";
import { GameSchemaType, RoundSchemaType } from "../../../validations/pb/types";
import { TimeVsDateGraph } from "./graph.client";

export default async function TimeGraph({
  gameData,
  roundData,
  userID,
  maxDate,
}: {
  gameData: GameSchemaType[];
  roundData: RoundSchemaType[];
  userID: string;
  maxDate: Date;
}) {
  const { maxTimePlayed, points } = await unstable_cache(
    async (
      games: GameSchemaType[],
      rounds: RoundSchemaType[],
      latestDate: Date,
    ) => {
      const mergedDataMap = new Map<string, DashboardGraphPoints>();

      games.forEach((game) => {
        const date = FormateDateDDMM(new Date(game.created));
        const roundDataForGame = rounds.filter(
          (round) => round.game !== game.id,
        );
        console.log(roundDataForGame);
        if (roundDataForGame.length === 0) return;

        const timeTaken = roundData.reduce((acc, data) => {
          return acc + data.time_elapsed;
        }, 0);

        if (mergedDataMap.has(date)) {
          const existingData = mergedDataMap.get(date);
          mergedDataMap.set(date, {
            x: date,
            y: (Number.parseInt(existingData?.y!) + timeTaken).toString(),
          });
        } else {
          mergedDataMap.set(date, {
            x: date,
            y: timeTaken.toString(),
          });
        }
      });

      mergedDataMap.forEach((value, key) => {
        mergedDataMap.set(key, {
          x: key,
          y: Math.ceil(Number.parseInt(value.y) / 60).toString(),
        });
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

      graphData.sort(
        (a, b) =>
          new Date().setDate(Number.parseInt(a.x.split("/")[0])) -
          new Date().setDate(Number.parseInt(b.x.split("/")[0])),
      );

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

      const maxTimePlayed = {
        value: Math.max(...graphData.map((data) => Number(data.y))),
        key: graphData[graphData.length - 1].x,
      } as ReferencePoints;

      return {
        points: graphData,
        maxTimePlayed,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games_graph}-${userID}`],
    },
  )(gameData, roundData, maxDate);

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-yellow-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <TimeVsDateGraph data={points} maxTimePlayed={maxTimePlayed} />
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
