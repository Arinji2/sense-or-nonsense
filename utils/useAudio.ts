import { useEffect, useRef, useState } from "react";
import { SavedSoundSettingsSchema } from "../validations/generic/schema";

export function useAudio(
  url: string,
  isLoopable?: boolean,
  localStorageKey?: string,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [volume, setVolume] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [hasErrored, setHasErrored] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.preload = "auto";
    }

    if (isPlayingRef.current) {
      audioRef.current.play().catch((e) => {
        setHasErrored(true);
      });
    }

    const handleAudioEnd = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    audioRef.current.addEventListener("ended", handleAudioEnd);

    return () => {
      audioRef.current?.removeEventListener("ended", handleAudioEnd);
      audioRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (localStorageKey) {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
          const jsonData = JSON.parse(storedData);
          const parse = SavedSoundSettingsSchema.safeParse(jsonData);
          if (parse.success) {
            setVolume(parse.data.volume);
            setIsEnabled(parse.data.isEnabled);
          }
        }
      }
    }
  }, [volume]);

  const play = () => {
    if (isEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch((e) => {
          setHasErrored(true);
        });

      if (isLoopable) {
        audioRef.current.loop = true;
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false; // Persist pause state
    }
  };

  return {
    play,
    pause,
    setVolume,
    volume,
    isEnabled,
    setIsEnabled,
    setHasErrored,
    hasErrored,
    isPlaying,
  };
}
