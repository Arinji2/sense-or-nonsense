import { useCallback, useEffect, useRef, useState } from "react";
import { SavedSoundSettingsSchema } from "../validations/generic/schema";

export function useAudio(
  url: string,
  isLoopable?: boolean,
  localStorageKey?: string,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState({
    volume: 1,
    isEnabled: true,
    hasErrored: false,
    isPlaying: false,
    isPaused: false,
  });

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.preload = "auto";
    }

    const audio = audioRef.current;

    const handleAudioEnd = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (audioRef.current) {
      if (localStorageKey) {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
          const jsonData = JSON.parse(storedData);
          const parse = SavedSoundSettingsSchema.safeParse(jsonData);
          if (parse.success) {
            setState((prev) => ({
              ...prev,
              volume: parse.data.volume,
              isEnabled: parse.data.isEnabled,
            }));
          }
        }
      }
    }
  }, [localStorageKey, state.volume]);

  const resume = useCallback(() => {
    if (state.isEnabled && audioRef.current) {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [state.isEnabled]);

  const play = useCallback(() => {
    if (state.isEnabled && audioRef.current) {
      // Only play if the audio is currently paused, no resetting the current time
      if (audioRef.current.paused && !state.isPaused) {
        audioRef.current
          .play()
          .then(() => {
            setState((prev) => ({ ...prev, isPlaying: true }));
          })
          .catch(() => {
            setState((prev) => ({ ...prev, hasErrored: true }));
          });

        if (isLoopable) {
          audioRef.current.loop = true;
        }
      }
    }
  }, [state.isEnabled, state.isPaused, isLoopable]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setState((prev) => ({ ...prev, volume: newVolume }));
  }, []);

  const setIsEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, isEnabled: enabled }));
  }, []);

  const setHasErrored = useCallback((errored: boolean) => {
    setState((prev) => ({ ...prev, hasErrored: errored }));
  }, []);

  return {
    play,
    pause,
    stop,
    resume,
    setVolume,
    setIsEnabled,
    setHasErrored,
    ...state,
  };
}
