import { GamesList } from "@/app/games";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StringSearchParamType } from "../../../../../validations/generic/types";
import { AccuracyGraph, TimeGraph } from "./graph.client";
import { GameInfo, GameStats } from "./stats";

import { GetGameData } from "../../../../../utils/game-data";
import { GetUserMode } from "../../../../../utils/getMode";
import { GameFighterSchemaType } from "../../../../../validations/game-data/types";
import RoundStats from "./round";
import { GetPlayerGraphs } from "./utils";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: {
    player: StringSearchParamType;
    round: StringSearchParamType;
    word: StringSearchParamType;
    analysis: StringSearchParamType;

    correct: StringSearchParamType;
    timeleft: StringSearchParamType;
  };
  params: {
    id: string;
  };
}) {
  const { pb, userID } = await GetUserMode();

  const { gameData, rounds } = await GetGameData(pb, params.id, userID!);

  if (!gameData.isValidated) redirect("/dashboard/games");

  let { playerData, gameID } = gameData;

  const gameIsMultiplayer =
    gameID === "1" ||
    GamesList.find((game) => game.id === Number.parseInt(gameID))!
      .isMultiplayer;
  let currentPlayerIndex = 0;
  let nextPlayerExists = false;
  let previousPlayerExists = false;

  if (gameID === "1" || gameIsMultiplayer) {
    {
      if (searchParams.player && !Array.isArray(searchParams.player)) {
        const searchPlayer = Number.parseInt(searchParams.player);
        if (typeof playerData[searchPlayer] === "undefined")
          currentPlayerIndex = 0;
        else currentPlayerIndex = searchPlayer;
      }
    }

    nextPlayerExists =
      typeof playerData[currentPlayerIndex + 1] !== "undefined";
    previousPlayerExists =
      typeof playerData[currentPlayerIndex - 1] !== "undefined";
  }

  const players = GetPlayerGraphs(playerData, rounds);

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E]">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-5 px-4 py-5 xl:px-0 xl:py-10"
      >
        <h1 className="text-base font-bold leading-relaxed tracking-title text-white md:text-xl">
          <Link
            href="/dashboard"
            className="block text-white/50 md:inline xl:text-lg"
          >
            DASHBOARD
          </Link>
          <Link
            href="/dashboard/games"
            className="block text-white/50 md:inline xl:text-lg"
          >
            /GAMES
          </Link>
          /Analysis
        </h1>
        {gameIsMultiplayer && (
          <MultiplayerNavigator
            previousPlayerExists={previousPlayerExists}
            id={params.id}
            currentPlayerIndex={currentPlayerIndex}
            playerData={playerData}
            nextPlayerExists={nextPlayerExists}
          />
        )}

        <div className="games-viewer relative grid h-fit w-full gap-5 md:min-h-[90svh]">
          <div className="game-stats rounded-sm bg-red-500/10 p-5">
            <GameStats data={players[currentPlayerIndex]} />
          </div>
          <div className="time-graph rounded-sm bg-blue-500/10 p-5">
            <TimeGraph
              data={players[currentPlayerIndex].graphPoints}
              minTimeLeft={players[currentPlayerIndex].minTimeLeft}
              maxTimeLeft={players[currentPlayerIndex].maxTimeLeft}
            />
          </div>
          <div className="game-info rounded-sm bg-green-500/10 p-5">
            <GameInfo gameData={gameData} index={currentPlayerIndex} />
          </div>
          <div className="accuracy-graph rounded-sm bg-yellow-500/10 p-5">
            <AccuracyGraph
              data={players[currentPlayerIndex].graphPoints}
              maxAccuracy={players[currentPlayerIndex].maxAccuracy}
              maxStreak={players[currentPlayerIndex].maxStreak}
            />
          </div>
        </div>

        <RoundStats
          currentPlayerIndex={currentPlayerIndex}
          game={rounds}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}

function MultiplayerNavigator({
  previousPlayerExists,
  id,
  currentPlayerIndex,
  playerData,
  nextPlayerExists,
}: {
  previousPlayerExists: boolean;
  id: string;
  currentPlayerIndex: number;
  playerData: GameFighterSchemaType[];
  nextPlayerExists: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 flex h-[50px] w-full flex-row items-center justify-between bg-black/20 px-4 py-2 backdrop-blur-sm">
      <Link
        scroll={false}
        href={
          previousPlayerExists
            ? `/dashboard/games/${id}?player=${currentPlayerIndex - 1}`
            : `/dashboard/games/${id}?player=${playerData.length - 1}`
        }
      >
        <ChevronLeftCircle className="h-6 w-6 text-white" />
      </Link>
      <p className="w-full max-w-[500px] truncate px-4 text-center text-sm text-white xl:text-base">
        <span className="hidden text-white/50 xl:inline">
          Currently Viewing
        </span>{" "}
        <span className="text-white/50">Player</span>{" "}
        {playerData[currentPlayerIndex].fighter_name}
      </p>
      <Link
        scroll={false}
        href={
          nextPlayerExists
            ? `/dashboard/games/${id}?player=${currentPlayerIndex + 1}`
            : `/dashboard/games/${id}?player=${0}`
        }
      >
        <ChevronRightCircle className="h-6 w-6 text-white" />
      </Link>
    </div>
  );
}
