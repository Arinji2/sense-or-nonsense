"use client";
import { useEffect, useState } from "react";
export default function useAnimate(animationDuration: number) {
  const [queue, setQueue] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [actualState, setActualState] = useState(false);

  useEffect(() => {
    if (queue) {
      setActualState(true);
      const interval = setTimeout(() => {
        setShowComponent(true);
      }, 20);
      return () => {
        clearTimeout(interval);
      };
    } else {
      setShowComponent(false);
      const interval = setTimeout(() => {
        setActualState(false);
      }, animationDuration + 100);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [queue, animationDuration]);

  return { showComponent, actualState, setQueue, queue } as const;
}
