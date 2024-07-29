"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EncryptGameDataAction } from "../../../utils/game-data";
import { useRouterRefresh } from "../../../utils/useRouterRefresh";
import {
  GameFighterSchemaType,
  RoundsSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { GamesList } from "../games";

function GetRoundChange({
  previousGames,
  fighters,
}: {
  previousGames: RoundsSchemaType[];
  fighters: GameFighterSchemaType[];
}) {
  const hasPlayed = new Set<number>();
  let goToNextRound = true;
  let previousRound = previousGames[previousGames.length - 1].round;

  if (previousGames.length < fighters.length) return false;

  for (let i = previousGames.length - 1; i >= 0; i--) {
    if (hasPlayed.size === fighters.length) break;
    const game = previousGames[i];

    const round = game.round;
    const player = game.playerIndex;

    if (hasPlayed.has(player)) continue;

    hasPlayed.add(player);

    if (round !== previousRound) {
      goToNextRound = false;

      break;
    }
    previousRound = round;
  }

  return goToNextRound;
}

export default function Controls({
  data,
  previousGames,
  gameData,
  streak,
  playerName,
  fighters,
  maxRounds,
}: {
  data: WordSchemaType;
  previousGames: RoundsSchemaType[];
  gameData: (typeof GamesList)[0];
  streak: number;
  playerName: string;
  fighters: GameFighterSchemaType[];
  maxRounds: number;
}) {
  const [timer, setTimer] = useState(10);
  const [loading, setLoading] = useState(false);
  const refresh = useRouterRefresh();
  const router = useRouter();

  const answerSubmitted = useCallback(
    async (correct?: boolean) => {
      const previousGame = previousGames[previousGames.length - 1];

      const currentRoundData = {
        round: previousGame.round,
        playerIndex: previousGame.playerIndex,
        isCorrect: correct,
        recordID: data.id,
        timeElapsed: 10 - timer,
        isFake: data.isFake,
      } as RoundsSchemaType;

      const goToNextRound = GetRoundChange({
        previousGames,
        fighters,
      });

      const newPlayerIndex = goToNextRound
        ? 0
        : currentRoundData.playerIndex + 1;

      const nextRoundData = {
        round: goToNextRound
          ? currentRoundData.round + 1
          : currentRoundData.round,
        playerIndex: newPlayerIndex,
        isCorrect: false,
        recordID: "",
        timeElapsed: 10,
        isFake: false,
      } as RoundsSchemaType;

      previousGames.pop();

      if (nextRoundData.round > maxRounds) {
        previousGames.push(currentRoundData);
        await EncryptGameDataAction({
          key: "game",
          deleteKey: true,
          value: "",
        });

        await EncryptGameDataAction({
          key: "game",
          value: JSON.stringify(previousGames),
        });
        router.push("/game/summary");
        return;
      }

      previousGames.push(currentRoundData, nextRoundData);

      await EncryptGameDataAction({
        key: "game",
        deleteKey: true,
        value: "",
      });

      await EncryptGameDataAction({
        key: "game",
        value: JSON.stringify(previousGames),
      });

      await refresh();
      setTimer(10);
      setLoading(false);
    },
    [
      previousGames,
      data.id,
      refresh,
      gameData,
      maxRounds,
      timer,
      fighters,
      router,
    ],
  );

  useEffect(() => {
    if (timer === 3 && !loading) {
      toast.success("3 seconds left!");
    }
    if (timer === 0 && !loading) {
      setLoading(true);
      toast.error("Time's Up! The Word Was " + (data.isFake ? "Fake" : "Real"));
      answerSubmitted(false);
    }
    const interval =
      timer > 0 && !loading
        ? setInterval(() => {
            setTimer((prev) => prev - 1);
          }, 1000)
        : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, loading, data.isFake, answerSubmitted]);

  const timerDisplay = useMemo(() => {
    return loading ? (
      <Loader2 className="size-[40px] animate-spin text-black" />
    ) : (
      <p className="text-[40px] font-bold text-black">{timer}</p>
    );
  }, [loading, timer]);

  return (
    <div className="flex h-fit w-full flex-row items-center justify-center gap-10 xl:gap-20">
      <button
        disabled={loading}
        onClick={() => {
          if (data.isFake) {
            toast.error("Incorrect, The Word Is Fake!");
            if (streak > 0) {
              toast.error(`${playerName} lost their streak!`);
            }
            answerSubmitted(false);
          } else {
            toast.success("Correct, The Word Is Real!");
            if (streak > 0) {
              toast.success(`${playerName} is on a ${streak + 1} word streak!`);
            } else {
              toast.success(`${playerName} has started a streak!`);
            }
            answerSubmitted(true);
          }
        }}
        className="group flex size-20 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10"
      >
        <Image
          src={"/game/real.png"}
          className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
          alt="Real"
          width={40}
          height={40}
        />
      </button>
      <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#FCAB3A] shadow-xl shadow-white/10">
        {timerDisplay}
      </div>
      <button
        disabled={loading}
        onClick={() => {
          if (!data.isFake) {
            toast.error("Incorrect, The Word Is Real!");
            if (streak > 0) {
              toast.error(`${playerName} lost their streak!`);
            }
            answerSubmitted(false);
          } else {
            toast.success("Correct, The Word Is Fake!");
            if (streak > 0) {
              toast.success(`${playerName} is on a ${streak + 1} word streak!`);
            } else {
              toast.success(`${playerName} has started a streak!`);
            }
            answerSubmitted(true);
          }
        }}
        className="group flex size-20 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10"
      >
        <Image
          className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
          src={"/game/fake.png"}
          alt="Fake"
          width={40}
          height={40}
        />
      </button>
    </div>
  );
}
