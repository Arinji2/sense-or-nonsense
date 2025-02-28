import { Heart } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CACHED_TAGS } from "../../../../constants/tags";
import { GetUserMode } from "../../../../utils/getMode";
import { GameSchema, RoundSchema } from "../../../../validations/pb/schema";
import AccuracyGraph, { FallbackAccuracyGraph } from "./accuracy-graph";
import GamesGraph, { FallbackGamesGraph } from "./games-graph";
import { DefaultsButton } from "./links.client";
import TimeGraph, { FallbackTimeGraph } from "./time-graph";

export default async function Page() {
  const { pb, userID, mode } = await GetUserMode();

  if (userID === null) {
    redirect("/");
  }

  const { gameData, roundsData, maxDate } = await unstable_cache(
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
        filter: `user = "${userID}" && (gameID = "1" || gameID = "0") && created > "${minDate.toISOString()}" && completed=true`,
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
          gameData.map(async (game) => {
            return await pb.collection("rounds").getFullList({
              filter: `game="${game.id}"`,
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

      const finalData = parsedGameData
        .map((game) => {
          const rounds = parsedRoundsData.filter(
            (round) => round.game === game.id,
          );
          return rounds;
        })
        .flat();

      return {
        gameData: parsedGameData,
        roundsData: finalData,
        minDate: minDate,
        maxDate: maxDate,
      };
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
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
          <div className="flex h-fit w-full flex-col items-center justify-start gap-3 rounded-md bg-blue-500/10 px-4 py-5 shadow-md shadow-black md:h-full xl:pb-3 xl:pt-1">
            <div className="flex h-fit w-full shrink-0 flex-col items-center justify-between gap-3 px-2 xl:h-[20%] xl:flex-row">
              <Link
                href="/single"
                className="flex h-fit w-full flex-col items-center justify-center rounded-sm bg-green-500 bg-opacity-30 px-3 py-2 leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70"
              >
                <p className="text-xs font-bold text-white md:text-xs">
                  SINGLE PLAYER
                </p>
              </Link>
              <Link
                href="/multi"
                className="flex h-fit w-full flex-col items-center justify-center rounded-sm bg-teal-500 bg-opacity-30 px-3 py-2 leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70"
              >
                <p className="text-xs font-bold text-white md:text-xs">
                  MULTI PLAYER
                </p>
              </Link>
            </div>
            <div className="flex h-fit w-full flex-col items-center justify-start gap-5 border-y-2 border-white/10 py-4">
              <h2 className="text-center text-xs font-bold text-white">
                QUICK LINKS
              </h2>
              <div className="grid h-fit w-full grid-cols-1 items-center justify-between gap-x-2 gap-y-6 xl:grid-cols-3 xl:gap-y-4">
                <Link
                  href="/dashboard/account"
                  className="h-fit w-full rounded-sm bg-orange-500 bg-opacity-30 px-3 py-2 text-center leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-full"
                >
                  <p className="text-xss font-bold text-white">Edit Account</p>
                </Link>
                <DefaultsButton isGuest={mode !== "user"} />
                <Link
                  href="/dashboard/games"
                  className="h-fit w-full rounded-sm bg-purple-500 bg-opacity-30 px-3 py-2 text-center leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-full"
                >
                  <p className="text-xss font-bold text-white">View Games</p>
                </Link>

                <Link
                  href="/dashboard/word-bank"
                  className="h-fit w-full rounded-sm bg-fuchsia-500 bg-opacity-30 px-3 py-2 text-center leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-full"
                >
                  <p className="text-xss font-bold text-white">
                    View Word Bank
                  </p>
                </Link>
                <div className="hidden w-full xl:block"></div>
                <Link
                  href="/"
                  className="h-fit w-full rounded-sm bg-blue-500 bg-opacity-30 px-3 py-2 text-center leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-full"
                >
                  <p className="text-xss font-bold text-white">Go To Home</p>
                </Link>
              </div>
            </div>
            <p className="mt-auto text-xss text-white/50">
              Made by Arinji with Love{" "}
              <Heart className="inline size-4 fill-red-500 text-red-500" />
            </p>
          </div>
          <Suspense fallback={<FallbackGamesGraph />}>
            <GamesGraph
              gameData={gameData}
              userID={userID!}
              maxDate={maxDate}
            />
          </Suspense>
          <Suspense fallback={<FallbackAccuracyGraph />}>
            <AccuracyGraph
              gameData={gameData}
              roundsData={roundsData}
              userID={userID!}
            />
          </Suspense>

          <Suspense fallback={<FallbackTimeGraph />}>
            <TimeGraph
              gameData={gameData}
              roundsData={roundsData}
              userID={userID!}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
