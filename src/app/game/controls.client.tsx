"use client";

import { Bot, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { CreateNewRound, UpdateRound } from "@/actions/game/rounds";
import { FinishGameAction } from "@/actions/game/setup";
import { useRouterRefresh } from "../../../utils/useRouterRefresh";
import {
  GameFighterSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { RoundSchemaType } from "../../../validations/pb/types";
import { useMusic } from "./music-context";

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
  level,
  streak,
  playerName,
  fighters,
  maxRounds,
}: {
  data: WordSchemaType;
  previousGames: RoundSchemaType[];
  level: number;
  streak: number;
  playerName: string;
  fighters: GameFighterSchemaType[];
  maxRounds: number;
}) {
  const [timer, setTimer] = useState(10);
  const [loading, setLoading] = useState(false);
  const refresh = useRouterRefresh();
  const router = useRouter();
  const [aiThinking, setAiThinking] = useState(false);
  const trueButtonRef = useRef<HTMLButtonElement | null>(null);
  const falseButtonRef = useRef<HTMLButtonElement | null>(null);

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
        game: "",
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
        const resolve = toast.promise(UpdateRound(currentRoundData), {
          loading: "Finishing game...",
          success: "Game Finished Successfully",
          error: "Failed to finish game",
        });
        await resolve;

        const ID = await FinishGameAction();
        router.push(`/dashboard/games/${ID}`);

        return;
      } else {
        try {
          UpdateRound(currentRoundData);
          CreateNewRound(nextRoundData);
        } catch (e) {
          toast.error("Failed to update round");
          router.refresh();
          return;
        }
        await refresh();
        setTimer(10);
      }

      setAiThinking(false);
      setLoading(false);
    },
    [
      previousGames,
      data.id,
      refresh,
      maxRounds,
      timer,
      fighters,
      router,
      data.isFake,
      loading,
    ],
  );

  useEffect(() => {
    if (loading || aiThinking) return;
    if (playerName === "CPU") {
      setAiThinking(true);
      toast.success("CPU is thinking...");
      setTimeout(() => {
        let answer: boolean = false;

        if (level === 1) {
          answer = Math.random() < 0.5;
        } else if (level === 2) {
          const checkAnswer = Math.random() < 0.6;
          if (checkAnswer) {
            answer = !data.isFake;
          } else {
            answer = Math.random() < 0.5;
          }
        } else if (level === 3) {
          const checkAnswer = Math.random() < 0.8;
          if (checkAnswer) {
            answer = !data.isFake;
          } else {
            answer = Math.random() < 0.5;
          }
        }

        if (answer) {
          if (data.isFake) {
            toast.error("CPU was Incorrect, The Word Is Fake!");
            answerSubmitted(false);
          } else {
            toast.success("CPU was Correct, The Word Is Real!");
            answerSubmitted(true);
          }
        } else {
          if (data.isFake) {
            toast.success("CPU was Correct, The Word Is Fake!");
            answerSubmitted(true);
          } else {
            toast.error("CPU was Incorrect, The Word Is Real!");
            answerSubmitted(false);
          }
        }

        setAiThinking(false);
      }, 2000);
    }
  }, [loading, aiThinking, playerName, data.isFake, level, answerSubmitted]);

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
    return aiThinking ? (
      <Bot className="size-[15px] animate-pulse text-black md:size-[25px]" />
    ) : loading ? (
      <Loader2 className="size-[15px] animate-spin text-black md:size-[25px]" />
    ) : (
      <p className="text-center text-[15px] font-bold text-black md:text-[25px]">
        {timer}
      </p>
    );
  }, [loading, timer, aiThinking]);

  const { isCorrectAudio, isWrongAudio } = useMusic();

  return (
    <div className="flex h-fit w-full flex-row items-center justify-center gap-10 xl:gap-20">
      <button
        ref={trueButtonRef}
        disabled={loading || aiThinking}
        onClick={() => {
          if (loading) return;
          if (data.isFake) {
            toast.error("Incorrect, The Word Is Fake!");

            isWrongAudio.play();
            if (streak > 0) {
              toast.error(`${playerName} lost their streak!`);
            }
            answerSubmitted(false);
          } else {
            toast.success("Correct, The Word Is Real!");

            isCorrectAudio.play();
            if (streak > 0) {
              toast.success(`${playerName} is on a ${streak + 1} word streak!`);
            } else {
              toast.success(`${playerName} has started a streak!`);
            }
            answerSubmitted(true);
          }
        }}
        className="group flex size-16 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10 disabled:grayscale xl:size-20"
      >
        <div className="relative size-[30px] xl:size-[40px]">
          <Image
            src={"/game/real.png"}
            className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
            alt="Real"
            fill
            sizes="(min-width: 1280px) 40px, 30px"
          />
        </div>
      </button>
      <div className="flex size-16 flex-col items-center justify-center rounded-full bg-[#FCAB3A] p-3 tracking-number shadow-xl shadow-white/10 md:size-20">
        {timerDisplay}
      </div>
      <button
        ref={falseButtonRef}
        disabled={loading || aiThinking}
        onClick={() => {
          if (loading) return;
          if (!data.isFake) {
            toast.error("Incorrect, The Word Is Real!");
            isWrongAudio.play();
            if (streak > 0) {
              toast.error(`${playerName} lost their streak!`);
            }
            answerSubmitted(false);
          } else {
            toast.success("Correct, The Word Is Fake!");
            isCorrectAudio.play();
            if (streak > 0) {
              toast.success(`${playerName} is on a ${streak + 1} word streak!`);
            } else {
              toast.success(`${playerName} has started a streak!`);
            }
            answerSubmitted(true);
          }
        }}
        className="group flex size-16 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10 disabled:grayscale xl:size-20"
      >
        <div className="relative size-[30px] xl:size-[40px]">
          <Image
            className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
            src={"/game/fake.png"}
            alt="Fake"
            fill
            sizes="(min-width: 1280px) 40px, 30px"
          />
        </div>
      </button>
    </div>
  );
}
