import { GamesList } from "@/app/games";
import WidthWrapper from "@/wrappers/width-wrapper";
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
    <div className="flex h-fit w-full flex-col items-center justify-start">
      <WidthWrapper>
        <div className="relative flex h-fit w-full flex-col items-center justify-start gap-12 pb-10">
          <h1 className="tracking-subtitle w-full px-2 text-center text-[35px] font-bold text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
            GAME OVER
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

          <div
            className="relative hidden min-h-[90svh] w-full gap-5 xl:grid"
            style={{
              gridTemplateColumns: "auto 1fr",
              gridTemplateRows: "1fr 1fr",
            }}
          >
            <div className="rounded-sm bg-red-500/10 p-5">
              <GameStats data={players[currentPlayerIndex]} />
            </div>
            <div className="rounded-sm bg-blue-500/10 p-5">
              <TimeGraph
                data={players[currentPlayerIndex].graphPoints}
                minTimeLeft={players[currentPlayerIndex].minTimeLeft}
                maxTimeLeft={players[currentPlayerIndex].maxTimeLeft}
              />
            </div>
            <div className="rounded-sm bg-green-500/10 p-5">
              <GameInfo gameData={gameData} index={currentPlayerIndex} />
            </div>
            <div className="rounded-sm bg-yellow-500/10 p-5">
              <AccuracyGraph
                data={players[currentPlayerIndex].graphPoints}
                maxAccuracy={players[currentPlayerIndex].maxAccuracy}
                maxStreak={players[currentPlayerIndex].maxStreak}
              />
            </div>
          </div>

          <div
            className="grid min-h-[90svh] w-full grid-cols-1 gap-5 xl:hidden xl:grid-cols-2 xl:grid-rows-2"
            style={{
              gridTemplateRows: "1fr 1fr",
            }}
          >
            <div className="w-full rounded-sm bg-red-500/10 p-5">
              <GameStats data={players[currentPlayerIndex]} />
            </div>
            <div className="w-full rounded-sm bg-green-500/10 p-5">
              <GameInfo gameData={gameData} index={currentPlayerIndex} />
            </div>
            <div className="w-full rounded-sm bg-blue-500/10 p-5">
              <TimeGraph
                data={players[currentPlayerIndex].graphPoints}
                minTimeLeft={players[currentPlayerIndex].minTimeLeft}
                maxTimeLeft={players[currentPlayerIndex].maxTimeLeft}
              />
            </div>
            <div className="w-full rounded-sm bg-yellow-500/10 p-5">
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
      </WidthWrapper>
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
