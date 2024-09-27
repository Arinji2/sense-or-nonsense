"use client";

import { SettingsIcon } from "lucide-react";
import { useMusic } from "./music-context";

export default function Settings() {
  const { backgroundMusic } = useMusic();

  return (
    <button
      aria-label="Settings"
      onClick={() => {
        backgroundMusic.setHasErrored(true);
      }}
      className="fixed right-2 top-10 z-30 flex flex-row items-center justify-center gap-2 rounded-md bg-black px-3 py-2 xl:right-5 xl:top-20"
    >
      <SettingsIcon className="size-5 text-neutral-400" />
    </button>
  );
}
