import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { FormateDateDDMM } from "../../../utils/formatting";
import { GetUserMode } from "../../../utils/getMode";
import { GamesVsTimeGraphPoints } from "../../../validations/generic/types";
import { GameSchema, RoundSchema } from "../../../validations/pb/schema";
import { RoundsVsDateGraph } from "./graph.client";

export default async function GamesGraph() {
  const { pb, mode, userID } = await GetUserMode();
  const graphData = await unstable_cache(
    async () => {
      const dateToCheckFor = await pb
        .collection("games")
        .getFirstListItem(
          `user = "${userID}" && (gameID = "1" || gameID = "0")`,
          {
            sort: "-created",
          },
        );
      const maxDate = new Date(dateToCheckFor.created);

      const minDate = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const gameData = await pb.collection("games").getFullList({
        batch: 100,
        filter: `user = "${userID}" && (gameID = "1" || gameID = "0") && created > "${minDate.toISOString()}"`,
        sort: "-created",
      });

      const parsedGameData = gameData
        .map((game) => {
          const parse = GameSchema.safeParse(game);
          if (parse.success) {
            return parse.data;
          }
          return null;
        })
        .filter((game) => game !== null);

      const roundsData = (
        await Promise.all(
          parsedGameData.map(async (game) => {
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

      const finalData = parsedGameData.map((game) => {
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
      revalidate: 1,
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
