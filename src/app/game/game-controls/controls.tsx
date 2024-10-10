"use client";

import FakeImage from "@/../../public/game/fake.png";
import RealImage from "@/../../public/game/real.png";
import { CreateNewRound, UpdateRound } from "@/actions/game/rounds";
import { FinishGameAction } from "@/actions/game/setup";
import { RevalidateAction } from "@/actions/revalidate";
import useCpuTurn from "@/hooks/useCpuTurn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CACHED_TAGS } from "../../../../constants/tags";
import { useRouterRefresh } from "../../../../utils/useRouterRefresh";
import {
  GameFighterSchemaType,
  WordSchemaType,
} from "../../../../validations/game-data/types";
import { RoundSchemaType } from "../../../../validations/pb/types";
import { useMusicContext } from "../context/music-context";
import { useTimerContext } from "../context/timer-context";
import LoadingAnimation from "./components/LoadingAnimation";
import TImerDisplay from "./components/TimerDisplay";

export default function Controls({
  currentRoundData,
  nextRoundData,
  maxRounds,
  currentStreak,
  wordData,
  difficultyLevel,
  currentPlayer,
  isMultiPlayer,
  userID,
}: {
  currentRoundData: RoundSchemaType;
  nextRoundData: RoundSchemaType;
  maxRounds: number;
  currentStreak: number;
  wordData: WordSchemaType;
  difficultyLevel: number;
  currentPlayer: GameFighterSchemaType;
  isMultiPlayer: boolean;
  userID: string;
}) {
  const { startTimer, stopTimer, timer, resetTimer } = useTimerContext();
  const { isCorrectAudio, isWrongAudio, backgroundMusic } = useMusicContext();
  const [loading, setLoading] = useState(false);

  const [isCorrect, setIsCorrect] = useState<0 | 1 | 2>(0);
  const [streakCopy, setStreakCopy] = useState(currentStreak);
  const isSubmittingRef = useRef(false);
  const wordIDCopy = useRef("");
  const router = useRouter();
  const refresh = useRouterRefresh();
  const answerSubmitted = useCallback(
    async (correct?: boolean) => {
      if (loading || isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setStreakCopy(currentStreak);
      stopTimer();
      setLoading(true);
      const startTime = new Date();

      currentRoundData.correct = correct ?? false;
      currentRoundData.time_elapsed = 10 - timer;

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
          UpdateRound(currentRoundData, true);
          CreateNewRound(nextRoundData, true);
        } catch (e) {
          toast.error("Failed to update round");
          router.refresh();
          return;
        }

        const currentTime = new Date().getTime();

        const reset = async () => {
          setStreakCopy(0);
          setIsCorrect(0);
          resetTimer();

          setLoading(false);
          await Promise.all([
            RevalidateAction(
              "tag",
              `${CACHED_TAGS.game_data}-${userID}-${currentRoundData.game}`,
            ),

            RevalidateAction("tag", `${CACHED_TAGS.user_games}-${userID}`),
          ]);
          await refresh();

          isSubmittingRef.current = false;
        };
        const timeElapsed = currentTime - startTime.getTime();

        if (timeElapsed < 2000) {
          setTimeout(async () => {
            await reset();
          }, 2000 - timeElapsed);
        } else {
          await reset();
        }
      }
    },
    [
      currentRoundData,
      nextRoundData,
      maxRounds,
      timer,
      router,
      currentStreak,
      loading,
      refresh,
      resetTimer,
      stopTimer,
      userID,
    ],
  );
  const handleCPUTurn = useCpuTurn({
    isFakeWord: wordData.isFake,
    level: difficultyLevel,
    answerSubmitted,
  });

  useEffect(() => {
    if (wordIDCopy.current === wordData.id) return;
    if (loading) return;
    wordIDCopy.current = wordData.id;
    startTimer();

    if (currentPlayer.fighter_name === "CPU") handleCPUTurn();
  }, [
    wordData.id,
    loading,
    currentPlayer.fighter_name,
    handleCPUTurn,
    startTimer,
  ]);

  useEffect(() => {
    if (timer === 3) toast.success("3 seconds left!");
    if (timer === 0) {
      toast.error(
        "Time's Up! The Word Was " + (wordData.isFake ? "Fake" : "Real"),
      );
      answerSubmitted(false);
    }
  }, [timer, wordData.isFake, answerSubmitted]);

  return (
    <>
      <LoadingAnimation
        isMultiPlayer={isMultiPlayer}
        isCorrect={isCorrect}
        playerName={currentPlayer.fighter_name}
        streakCopy={streakCopy}
      />

      <div className="flex h-fit w-full flex-row items-center justify-center gap-10 xl:gap-20">
        <button
          disabled={loading}
          onClick={() => {
            if (loading) return;
            if (currentRoundData.is_fake) {
              setIsCorrect(1);

              isWrongAudio.play();

              answerSubmitted(false);
            } else {
              setIsCorrect(2);

              isCorrectAudio.play();

              answerSubmitted(true);
            }
          }}
          className="group flex size-16 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10 disabled:grayscale xl:size-20"
        >
          <div className="relative size-[30px] xl:size-[40px]">
            <Image
              src={RealImage}
              className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
              alt="Real"
              fill
              sizes="(min-width: 1280px) 40px, 30px"
            />
          </div>
        </button>
        <TImerDisplay aiThinking={false} loading={loading} />
        <button
          disabled={loading}
          onClick={() => {
            if (loading) return;
            if (!currentRoundData.is_fake) {
              setIsCorrect(1);
              isWrongAudio.play();

              answerSubmitted(false);
            } else {
              setIsCorrect(2);
              isCorrectAudio.play();
              answerSubmitted(true);
            }
          }}
          className="group flex size-16 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10 disabled:grayscale xl:size-20"
        >
          <div className="relative size-[30px] xl:size-[40px]">
            <Image
              className="transition-all duration-300 ease-in-out group-hover:-translate-y-1"
              src={FakeImage}
              alt="Fake"
              fill
              sizes="(min-width: 1280px) 40px, 30px"
            />
          </div>
        </button>
      </div>
    </>
  );
}
