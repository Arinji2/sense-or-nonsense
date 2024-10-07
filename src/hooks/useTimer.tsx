"use client";

import { useCallback, useRef, useState } from "react";

type TimerHook = [number, () => void, () => void, () => void, boolean];

export default function useTimer(
  defaultValue: number,
  updateKey: string,
): TimerHook {
  const [timer, setTimer] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);
  const timerID = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerID.current) return;

    setIsActive(true);
    const newTimerId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    timerID.current = newTimerId;
  }, [updateKey, timer, setTimer, setIsActive]);

  const stopTimer = useCallback(() => {
    if (!timerID.current) return;
    clearInterval(timerID.current);
    timerID.current = null;
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimer(defaultValue);
  }, [defaultValue, stopTimer]);

  return [timer, startTimer, stopTimer, resetTimer, isActive];
}
