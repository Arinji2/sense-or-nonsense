"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(defaultValue: number, updateKey: string) {
  const [timer, setTimer] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef(defaultValue);

  const startTimer = useCallback(() => {
    setIsActive(true);
    startTimeRef.current =
      Date.now() - (defaultValue - remainingTimeRef.current) * 1000;
  }, [defaultValue]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
    remainingTimeRef.current = timer;
  }, [timer]);

  useEffect(() => {
    if (isActive) {
      const updateTimer = () => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor(
          (currentTime - (startTimeRef.current || currentTime)) / 1000,
        );
        const newRemainingTime = Math.max(defaultValue - elapsedTime, 0);

        if (newRemainingTime !== timer) {
          setTimer(newRemainingTime);
        }

        if (newRemainingTime === 0) {
          setIsActive(false);
        } else {
          intervalRef.current = requestAnimationFrame(updateTimer);
        }
      };

      intervalRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timer, defaultValue]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimer(defaultValue);
    remainingTimeRef.current = defaultValue;
  }, [defaultValue, stopTimer]);

  return {
    timer,
    startTimer,
    stopTimer,
    resetTimer,
    isActive,
  };
}
