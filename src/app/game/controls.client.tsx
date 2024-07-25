"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EncryptGameDataAction } from "../../../utils/game-data";
import { useRouterRefresh } from "../../../utils/useRouterRefresh";
import {
  RoundsSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { GamesList } from "../games";

function GetRoundsAndPlayers(
  gameData: (typeof GamesList)[0],
  previousGames: RoundsSchemaType[],
  previousGame: RoundsSchemaType,
) {
  let roundNumber, indexNumber;

  if (gameData.isMultiplayer) {
    if (previousGames && previousGame) {
      if (previousGame.playerIndex === 1) {
        roundNumber = previousGame.round + 1;
      } else {
        roundNumber = previousGame.round;
      }
    } else {
      roundNumber = 1;
    }

    indexNumber = previousGame ? (previousGame.playerIndex === 1 ? 0 : 1) : 0;
  } else {
    roundNumber = previousGame ? previousGame.round + 1 : 1;

    indexNumber = 0;
  }

  return { roundNumber, indexNumber };
}

export default function Controls({
  data,
  previousGames,
  gameData,
  streak,
  playerName,
}: {
  data: WordSchemaType;
  previousGames: RoundsSchemaType[];
  gameData: (typeof GamesList)[0];
  streak: number;
  playerName: string;
}) {
  const [timer, setTimer] = useState(10);
  const [loading, setLoading] = useState(false);
  const refresh = useRouterRefresh();

  const answerSubmitted = useCallback(
    async (correct?: boolean) => {
      const previousGame = previousGames[previousGames.length - 1];

      const { indexNumber, roundNumber } = GetRoundsAndPlayers(
        gameData,
        previousGames,
        previousGame,
      );

      const roundData = {
        round: roundNumber,
        playerIndex: indexNumber,
        isCorrect: correct,
        recordID: data.id,
        timeElapsed: 10 - timer,
      } as RoundsSchemaType;

      previousGames.push(roundData);
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
    [previousGames, data.id, refresh, gameData],
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
