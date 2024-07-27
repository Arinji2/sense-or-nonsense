import { DifficultyList } from "@/app/difficulty/difficully";
import { GamesList } from "@/app/games";
import WidthWrapper from "@/wrappers/width-wrapper";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../../utils/game-data";
import {
  SummaryData,
  SummaryGraphPoints,
} from "../../../../validations/generic/types";
import { AccuracyGraph, TimeGraph } from "./graph";
import { GameInfo, GameStats } from "./stats";

export default async function Page({
  searchParams,
}: {
  searchParams: { player: string | string[] | undefined };
}) {
  const data = await DecryptGameDataAction();
  if (
    !data.game_id ||
    !data.difficulty ||
    !data.fighter_data ||
    !data.backdrop ||
    !data.game
  )
    redirect("/pregame");

  const { fighter_data, game, game_id, difficulty } = data;

  const gameIsMultiplayer = GamesList.find(
    (game) => game.id === Number.parseInt(game_id),
  )!.isMultiplayer;
  let currentPlayerIndex = 0;
  let nextPlayerExists = false;
  let previousPlayerExists = false;

  if (gameIsMultiplayer) {
    {
      if (searchParams.player && !Array.isArray(searchParams.player)) {
        const searchPlayer = Number.parseInt(searchParams.player);
        if (typeof fighter_data[searchPlayer] === "undefined")
          currentPlayerIndex = 0;
        else currentPlayerIndex = searchPlayer;
      }
    }

    nextPlayerExists =
      typeof fighter_data[currentPlayerIndex + 1] !== "undefined";
    previousPlayerExists =
      typeof fighter_data[currentPlayerIndex - 1] !== "undefined";
  }

  const players: SummaryData[] = [];

  fighter_data.forEach((_, index) => {
    let playerData = {
      correct: 0,
      incorrect: 0,
      timePlayed: 0,

      graphPoints: [] as SummaryGraphPoints[],
      maxAccuracy: 0,
      maxTimeLeft: 0,
      minTimeLeft: 0,
      maxStreak: {
        value: 0,
        round: 0,
      },
    };
    let playerStreak = 0;

    const difficultyData = DifficultyList.find(
      (game) => game.level === Number.parseInt(difficulty),
    )!;

    game.forEach((data, gameIndex) => {
      if (data.playerIndex !== index) return;

      let localStreak = playerStreak;

      if (data.isCorrect) {
        playerData.correct = playerData.correct + 1;
        localStreak = playerStreak + 1;
      } else {
        playerData.incorrect = playerData.incorrect + 1;
        localStreak = 0;
      }

      playerData.timePlayed = playerData.timePlayed + data.timeElapsed;

      playerData.graphPoints.push({
        x: data.round - 1,
        y: data.timeElapsed,
        accuracy: Math.round(
          (playerData.correct / (playerData.correct + playerData.incorrect)) *
            100,
        ),
      });

      playerData.maxTimeLeft = Math.max(
        playerData.maxTimeLeft,
        data.timeElapsed,
      );
      if (playerData.minTimeLeft === 0)
        playerData.minTimeLeft = data.timeElapsed;
      else
        playerData.minTimeLeft = Math.min(
          playerData.minTimeLeft,
          data.timeElapsed,
        );
      const localMaxStreak = Math.max(playerData.maxStreak.value, localStreak);

      if (localMaxStreak !== playerData.maxStreak.value) {
        playerData.maxStreak.value = localMaxStreak;

        playerData.maxStreak.round = data.round;
      }

      playerStreak = localStreak;
    });

    playerData.maxAccuracy = Math.max(
      playerData.maxAccuracy,
      ...playerData.graphPoints.map((player) => player.accuracy),
    );

    players.push(playerData);
  });

  console.log(players);

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
                    ? `/game/summary?player=${currentPlayerIndex - 1}`
                    : `/game/summary?player=${fighter_data.length - 1}`
                }
              >
                <ChevronLeftCircle className="h-6 w-6 text-white" />
              </Link>
              <p className="w-full max-w-[500px] truncate px-4 text-center text-sm text-white xl:text-base">
                <span className="hidden text-white/50 xl:inline">
                  Currently Viewing
                </span>{" "}
                <span className="text-white/50">Player</span>{" "}
                {fighter_data[currentPlayerIndex].fighter_name}
              </p>
              <Link
                scroll={false}
                href={
                  nextPlayerExists
                    ? `/game/summary?player=${currentPlayerIndex + 1}`
                    : `/game/summary?player=${0}`
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
        </div>
      </WidthWrapper>
    </div>
  );
}
