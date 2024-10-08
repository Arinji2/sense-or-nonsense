"use client";

import { useCallback, useRef, useState } from "react";

export default function useTimer(defaultValue: number, updateKey: string) {
  const [timer, setTimer] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerID = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatedTime = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timerID.current) return;

    setIsActive(true);
    setIsPaused(false);
    lastUpdatedTime.current = Date.now();

    const newTimerId = setInterval(() => {
      const now = Date.now();
      const delta = now - (lastUpdatedTime.current || now);
      lastUpdatedTime.current = now;

      setTimer((prevTimer) =>
        Math.max(prevTimer - Math.floor(delta / 1000), 0),
      );
    }, 100);

    timerID.current = newTimerId;
  }, []);

  const stopTimer = useCallback(() => {
    if (!timerID.current) return;
    clearInterval(timerID.current);
    timerID.current = null;
    lastUpdatedTime.current = null;
    setIsActive(false);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    if (!isActive || isPaused) return;
    clearInterval(timerID.current!);
    timerID.current = null;
    lastUpdatedTime.current = null;
    setIsPaused(true);
  }, [isActive, isPaused]);

  const resumeTimer = useCallback(() => {
    if (!isPaused) return;
    startTimer();
  }, [isPaused, startTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimer(defaultValue);
  }, [defaultValue, stopTimer]);

  return {
    timer,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    isActive,
    isPaused,
  };
}
