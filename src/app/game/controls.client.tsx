"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { CreateNewRound, UpdateRound } from "@/actions/game/rounds";
import { FinishGameAction } from "@/actions/game/setup";
import { useRouterRefresh } from "../../../utils/useRouterRefresh";
import {
  GameFighterSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { RoundSchemaType } from "../../../validations/pb/types";
import { GamesList } from "../games";

function GetRoundChange({
  previousGames,
  fighters,
}: {
  previousGames: RoundSchemaType[];
  fighters: GameFighterSchemaType[];
}) {
  const hasPlayed = new Set<number>();
  let goToNextRound = true;
  let previousRound = previousGames[previousGames.length - 1];

  if (previousGames.length < fighters.length) return false;

  for (let i = previousGames.length - 1; i >= 0; i--) {
    if (hasPlayed.size === fighters.length) break;
    const game = previousGames[i];

    const round = game;
    const player = game.player_index;

    if (hasPlayed.has(player)) continue;

    hasPlayed.add(player);

    if (round.round_number !== previousRound.round_number) {
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
  previousGames: RoundSchemaType[];
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
      if (loading) return;
      setLoading(true);
      const previousGame = previousGames[previousGames.length - 1];

      let fakeWord = "";
      let realWord = "";

      if (data.isFake) {
        fakeWord = data.id;
      } else {
        realWord = data.id;
      }
      const currentRoundData = {
        round_number: previousGame.round_number,
        player_index: previousGame.player_index,
        is_correct: correct,
        is_fake: data.isFake,
        time_elapsed: 10 - timer,
        fake_word: fakeWord,
        real_word: realWord,
        correct: correct,
        id: previousGame.id,
        created: new Date(),
        updated: new Date(),
      } as RoundSchemaType;

      const goToNextRound = GetRoundChange({
        previousGames,
        fighters,
      });

      const newPlayerIndex = goToNextRound
        ? 0
        : currentRoundData.player_index + 1;

      const nextRoundData = {
        round_number: goToNextRound
          ? currentRoundData.round_number + 1
          : currentRoundData.round_number,
        player_index: newPlayerIndex,
        correct: false,
        id: "",
        time_elapsed: 10,
        is_fake: false,
        fake_word: "",
        real_word: "",
      } as RoundSchemaType;

      previousGames.pop();

      if (nextRoundData.round_number > maxRounds) {
        toast.promise(UpdateRound(currentRoundData), {
          loading: "Finishing game...",
          success: "Game Finished Successfully",
          error: "Failed to finish game",
        });

        const ID = await FinishGameAction();
        router.push(`/dashboard/game/${ID}`);

        return;
      } else {
        UpdateRound(currentRoundData);
        CreateNewRound(nextRoundData);
        await refresh();
        setTimer(10);
      }
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
    if (loading) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 3) {
      toast.success("3 seconds left!");
    }
    if (timer === 0) {
      clearInterval(interval);
      toast.error("Time's Up! The Word Was " + (data.isFake ? "Fake" : "Real"));
      answerSubmitted(false);
    }

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
          if (loading) return;
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
          if (loading) return;
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
