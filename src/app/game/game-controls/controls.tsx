"use client";

import { Button } from "@/components/button";
import { useMusicContext } from "../context/music-context";
import { useTimerContext } from "../context/timer-context";

export default function Controls() {
  const { startTimer, stopTimer, timer, resetTimer } = useTimerContext();
  const { isCorrectAudio, isWrongAudio, backgroundMusic } = useMusicContext();

  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-4">
      <div className="h-fit w-fit bg-blue-500 p-5">{timer}</div>
      <Button
        onClick={startTimer}
        className="w-fit bg-red-500/60 text-xs text-white"
      >
        Start Timer
      </Button>
      <Button
        onClick={stopTimer}
        className="w-fit bg-red-500/60 text-xs text-white"
      >
        Stop Timer
      </Button>
      <Button
        onClick={resetTimer}
        className="w-fit bg-red-500/60 text-xs text-white"
      >
        Reset Timer
      </Button>

      <Button
        onClick={() => isCorrectAudio.play()}
        className="w-fit bg-green-500/60 text-xs text-white"
      >
        Play Correct Audio
      </Button>
      <Button
        onClick={() => isWrongAudio.play()}
        className="w-fit bg-green-500/60 text-xs text-white"
      >
        Play Wrong Audio
      </Button>
      <Button
        onClick={() => backgroundMusic.pause()}
        className="w-fit bg-green-500/60 text-xs text-white"
      >
        Pause Bg Audio
      </Button>
      <Button
        onClick={() => backgroundMusic.play()}
        className="w-fit bg-green-500/60 text-xs text-white"
      >
        Play Bg Audio
      </Button>
      <Button
        onClick={() => backgroundMusic.resume()}
        className="w-fit bg-green-500/60 text-xs text-white"
      >
        Resume Bg Audio
      </Button>
    </div>
  );
}
