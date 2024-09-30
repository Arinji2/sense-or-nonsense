import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Client from "pocketbase";
import { CACHED_TAGS } from "../../../constants/tags";
import { FormateDateDDMM } from "../../../utils/formatting";
import { GamesVsTimeGraphPoints } from "../../../validations/generic/types";
import { RoundSchema } from "../../../validations/pb/schema";
import { GameSchemaType } from "../../../validations/pb/types";
import { RoundsVsDateGraph } from "./graph.client";

export default async function GamesGraph({
  gameData,
  pb,
  userID,
}: {
  gameData: GameSchemaType[];
  pb: Client;
  userID: string;
}) {
  const graphData = await unstable_cache(
    async () => {
      const roundsData = (
        await Promise.all(
          gameData.map(async (game) => {
            return await pb.collection("rounds").getFullList({
              filter: `game="${game.id}" && correct = true`,
            });
          }),
        )
      ).flat();

      const parsedRoundsData = roundsData
        .map((round) => {
          const parse = RoundSchema.safeParse(round);
          if (parse.success) {
            return parse.data;
          }
          if (parse.error) {
          }
          return null;
        })
        .filter((round) => round !== null);

      const finalData = gameData.map((game) => {
        const rounds = parsedRoundsData.filter(
          (round) => round.game === game.id,
        );
        return {
          ...game,
          rounds: rounds,
          score: rounds.length,
        };
      });

      const mergedDataMap = new Map<string, GamesVsTimeGraphPoints>();

      finalData.forEach((data) => {
        const date = FormateDateDDMM(new Date(data.created));
        if (mergedDataMap.has(date)) {
          const existingData = mergedDataMap.get(date)!;
          existingData.y += 1;
          existingData.data.push({
            ID: data.id,
          });
        } else {
          mergedDataMap.set(date, {
            x: date,
            y: 1,
            data: [
              {
                ID: data.id,
              },
            ],
          });
        }
      });

      let graphData = Array.from(mergedDataMap.values());

      graphData.sort(
        (a, b) => new Date(b.x).getTime() - new Date(a.x).getTime(),
      );

      let latestDate = new Date();
      if (graphData[0].x) {
        latestDate.setDate(Number.parseInt(graphData[0]?.x.split("/")[0]));
      }
      for (let i = 0; i < 7; i++) {
        const date = new Date(latestDate);
        date.setDate(date.getDate() - i);
        const formattedDate = FormateDateDDMM(date);
        if (!mergedDataMap.has(formattedDate)) {
          graphData.push({
            x: formattedDate,
            y: 0,
            data: [],
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

      return graphData;
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games_graph}-${userID}`],
    },
  )();

  return (
    <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-red-500/10 p-2 px-4 shadow-md shadow-black md:h-full">
      <RoundsVsDateGraph data={graphData} />
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
