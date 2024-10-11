"use client";

import AllowMusic from "@/modals/allow-music";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AUDIOLIST } from "../../../../constants/audio";
import useAnimate from "../../../../utils/useAnimate";
import { SavedSoundSettingsSchema } from "../../../../validations/generic/schema";
import {
  AudioHookReturn,
  SavedSoundSettingsSchemaType,
} from "../../../../validations/generic/types";
import { useAudio } from "../../../hooks/useAudio";
import { useTimerContext } from "./timer-context";

type MusicContextType = {
  backgroundMusic: AudioHookReturn;
  isCorrectAudio: AudioHookReturn;
  isWrongAudio: AudioHookReturn;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusicContext must be used within a MusicProvider");
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
  const { stopTimer } = useTimerContext();
  const [backgroundMusicSettings, setBackgroundMusicSettings] =
    useState<SavedSoundSettingsSchemaType>();

  const getBackgroundMusicSettings = useCallback(() => {
    const backgroundMusicSettings = localStorage.getItem(
      "backgroundMusicSettings",
    );
    if (backgroundMusicSettings) {
      const jsonData = JSON.parse(backgroundMusicSettings);
      const parse = SavedSoundSettingsSchema.safeParse(jsonData);
      if (parse.success) {
        return parse.data;
      }
    }
    return null;
  }, []);

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
    const settings = getBackgroundMusicSettings();
    if (
      !backgroundMusic.isPlaying &&
      !backgroundMusic.hasErrored &&
      backgroundMusic.isEnabled &&
      settings?.isEnabled
    ) {
      backgroundMusic.play();
    }

    if (backgroundMusic.hasErrored) {
      animate.setQueue(true);
      stopTimer();
    }
  }, [animate, backgroundMusic, stopTimer]);

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
