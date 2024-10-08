"use client";

import AllowMusic from "@/modals/allow-music";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AUDIOLIST } from "../../../constants/audio";
import useAnimate from "../../../utils/useAnimate";
import { useAudio } from "../../../utils/useAudio";
import { AudioHookReturn } from "../../../validations/generic/types";
import { useTimerContext } from "../game/context/timer-context";

type MusicContextType = {
  backgroundMusic: AudioHookReturn;
  isCorrectAudio: AudioHookReturn;
  isWrongAudio: AudioHookReturn;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

export function MusicProvider({
  children,
  allowedPaths,
}: {
  children: React.ReactNode;
  allowedPaths: string[];
}) {
  const pathname = usePathname();
  const url = useRef<string>(
    AUDIOLIST[Math.floor(Math.random() * AUDIOLIST.length)],
  );
  const backgroundMusic = useAudio(
    url.current,
    true,
    "backgroundMusicSettings",
  );
  const isCorrectAudio = useAudio(
    "https://cdn.arinji.com/u/gdwhWK.mp3",
    false,
    "sfxSoundSettings",
  );
  const isWrongAudio = useAudio(
    "https://cdn.arinji.com/u/cMbLmP.mp3",
    false,
    "sfxSoundSettings",
  );
  const [documentDefined, setDocumentDefined] = useState(false);
  const animate = useAnimate(800);
  const { pauseTimer } = useTimerContext();

  useEffect(() => {
    setDocumentDefined(true);
  }, []);

  useEffect(() => {
    if (!allowedPaths.includes(pathname)) {
      if (backgroundMusic.isPlaying) {
        backgroundMusic.stop();
      }
    }
  }, [pathname, allowedPaths, backgroundMusic]);

  useEffect(() => {
    if (!backgroundMusic.isPlaying && !backgroundMusic.hasErrored) {
      backgroundMusic.play();
    }

    if (backgroundMusic.hasErrored) {
      animate.setQueue(true);
      pauseTimer();
    }
  }, [animate, backgroundMusic]);

  const contextValue = useMemo(
    () => ({
      backgroundMusic,
      isCorrectAudio,
      isWrongAudio,
    }),
    [backgroundMusic, isCorrectAudio, isWrongAudio],
  );

  return (
    <MusicContext.Provider value={contextValue}>
      {documentDefined &&
        backgroundMusic.hasErrored &&
        createPortal(
          <AllowMusic
            Animate={animate}
            backgroundAudio={backgroundMusic}
            isCorrectAudio={isCorrectAudio}
            isWrongAudio={isWrongAudio}
          />,
          document.body,
        )}
      {children}
    </MusicContext.Provider>
  );
}
