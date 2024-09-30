import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CACHED_TAGS } from "../../../constants/tags";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
import GamesGraph, { FallbackGamesGraph } from "./games-graph";

export default async function Page() {
  const { pb, userID } = await GetUserMode();

  if (userID === null) {
    redirect("/");
  }

  const { gameData } = await unstable_cache(
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

      return {
        gameData: parsedGameData,
        minDate: minDate,
        maxDate: maxDate,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games_graph}-${userID}`],
    },
  )();

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-2xl font-bold tracking-title text-white md:text-4xl">
          DASHBOARD
        </h1>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="grid h-full w-full grid-cols-1 gap-8 xl:grid-cols-2 xl:grid-rows-2"
        >
          <Suspense fallback={<FallbackGamesGraph />}>
            <GamesGraph gameData={gameData} pb={pb} userID={userID!} />
          </Suspense>
          <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-green-500/10 p-2 px-4 shadow-md shadow-black md:h-full"></div>

          <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-yellow-500/10 p-2 px-4 shadow-md shadow-black md:h-full"></div>

          <div className="flex h-[450px] w-full flex-row items-center justify-center gap-3 rounded-md bg-blue-500/10 p-2 px-4 shadow-md shadow-black md:h-full"></div>
        </div>
      </div>
    </div>
  );
}
