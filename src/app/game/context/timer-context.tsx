"use client";

import useTimer from "@/hooks/useTimer";
import React, { createContext, useContext } from "react";

type TimerContextType = {
  startTimer: () => void;
  stopTimer: () => void;
  isActive: boolean;
  timer: number;
  isPaused: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
};

export const TimerContext = createContext<TimerContextType | undefined>(
  undefined,
);

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}

export function TimerProvider({
  children,
  defaultTimer,
  uniqueIdentifier,
}: {
  children: React.ReactNode;
  defaultTimer: number;
  uniqueIdentifier: string;
}) {
  const {
    startTimer,
    stopTimer,
    isActive,
    timer,
    isPaused,
    pauseTimer,
    resumeTimer,
    resetTimer,
  } = useTimer(defaultTimer, uniqueIdentifier);

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        stopTimer,
        isActive,
        timer,
        isPaused,
        pauseTimer,
        resumeTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
