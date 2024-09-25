import { GamesList } from "@/app/games";
import WidthWrapper from "@/wrappers/width-wrapper";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  StringSearchParamType,
  SummaryData,
  SummaryGraphPoints,
} from "../../../../../validations/generic/types";
import { AccuracyGraph, TimeGraph } from "./graph";
import { GameInfo, GameStats } from "./stats";

import Client from "pocketbase";
import { GetUserMode } from "../../../../../utils/getMode";
import { GameSchema } from "../../../../../validations/pb/schema";
import RoundStats from "./round";

async function GetGameData({
  pb,
  gameID,
  userID,
}: {
  pb: Client;
  gameID: string;
  userID: string;
}) {
  try {
    const pbGameData = await pb
      .collection("games")
      .getFirstListItem(`id="${gameID}"&&user="${userID}"`, {
        expand: "rounds,rounds.fake_word,rounds.real_word",
      });

    const parsedData = GameSchema.safeParse(pbGameData);

    if (!parsedData.success) {
      redirect("/dashboard");
    }

    return parsedData.data;
  } catch (e) {
    redirect("/dashboard");
  }
}

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: {
    player: StringSearchParamType;
    round: StringSearchParamType;
    word: StringSearchParamType;

    correct: StringSearchParamType;
    timeleft: StringSearchParamType;
  };
  params: {
    id: string;
  };
}) {
  const { pb, userID } = await GetUserMode();

  const data = await GetGameData({
    pb,
    gameID: params.id,
    userID: userID!,
  });

  if (!data.isValidated) redirect("/pregame");

  let { playerData, gameID } = data;
  if (typeof playerData === "boolean") redirect("/pregame");

  const rounds = data.expand?.rounds;
  if (rounds === undefined) redirect("/pregame");

  const gameIsMultiplayer = GamesList.find(
    (game) => game.id === Number.parseInt(gameID),
  )!.isMultiplayer;
  let currentPlayerIndex = 0;
  let nextPlayerExists = false;
  let previousPlayerExists = false;

  if (gameIsMultiplayer) {
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

  const players: SummaryData[] = [];
  playerData.forEach((_, index) => {
    let playerData = {
      correct: 0,
      incorrect: 0,
      timePlayed: 0,
      graphPoints: [] as SummaryGraphPoints[],
      maxAccuracy: 0,
      maxTimeLeft: 0,
      minTimeLeft: Infinity as number,
      maxStreak: {
        value: 0,
        round: 0,
      },
    };
    let playerStreak = 0;

    rounds.forEach((round) => {
      if (round.player_index !== index) return;

      let localStreak = playerStreak;

      if (round.correct) {
        playerData.correct += 1;
        localStreak = playerStreak + 1;
      } else {
        playerData.incorrect += 1;
        localStreak = 0;
      }

      const timeTakenForRound = 10 - round.time_elapsed;

      playerData.timePlayed += round.time_elapsed;

      playerData.graphPoints.push({
        x: round.round_number,
        y: timeTakenForRound,
        accuracy: Math.round(
          (playerData.correct / (playerData.correct + playerData.incorrect)) *
            100,
        ),
      });

      playerData.maxTimeLeft = Math.max(
        playerData.maxTimeLeft,
        timeTakenForRound,
      );

      playerData.minTimeLeft = Math.min(
        playerData.minTimeLeft,
        timeTakenForRound,
      );

      const localMaxStreak = Math.max(playerData.maxStreak.value, localStreak);

      if (localMaxStreak !== playerData.maxStreak.value) {
        playerData.maxStreak.value = localMaxStreak;
        playerData.maxStreak.round = round.round_number;
      }

      playerStreak = localStreak;
    });

    playerData.maxAccuracy = Math.max(
      playerData.maxAccuracy,
      ...playerData.graphPoints.map((point) => point.accuracy),
    );

    if (playerData.minTimeLeft === Infinity) playerData.minTimeLeft = 0;

    players.push(playerData as SummaryData);
  });

  return (
    <div className="flex h-fit w-full flex-col items-center justify-start">
      <WidthWrapper>
        <div className="relative flex h-fit w-full flex-col items-center justify-start gap-12 pb-10">
          <h1 className="w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
            GAME OVER
          </h1>
          {gameIsMultiplayer && (
            <div className="sticky top-0 z-40 flex h-[50px] w-full flex-row items-center justify-between bg-black/20 px-4 py-2 backdrop-blur-sm">
              <Link
                scroll={false}
                href={
                  previousPlayerExists
                    ? `/dashboard/game/${params.id}?player=${currentPlayerIndex - 1}`
                    : `/dashboard/game/${params.id}?player=${playerData.length - 1}`
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
                    ? `/dashboard/game/${params.id}?player=${currentPlayerIndex + 1}`
                    : `/dashboard/game/${params.id}?player=${0}`
                }
              >
                <ChevronRightCircle className="h-6 w-6 text-white" />
              </Link>
            </div>
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
              <GameInfo gameData={data} index={currentPlayerIndex} />
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
              <GameInfo gameData={data} index={currentPlayerIndex} />
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
