"use client";

import OngoingGame from "@/modals/ongoing-game-modal";
import { Music, SettingsIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../utils/cn";
import useAnimate from "../../../utils/useAnimate";
import { useMusic } from "./music-context";

export default function Settings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [documentDefined, setDocumentDefined] = useState(false);
  const animate = useAnimate(800);
  useEffect(() => {
    setDocumentDefined(true);
  }, []);
  const { backgroundMusic } = useMusic();

  useEffect(() => {
    if (!animate.queue && showDelete) {
      setShowDelete(false);
    }
  }, [animate.queue]);

  return (
    <>
      {documentDefined &&
        createPortal(
          <OngoingGame Animate={animate} isDeleting={true} />,
          document.body,
        )}
      <div
        aria-label="Settings"
        className={cn(
          {
            "fixed right-2 top-5 z-30 flex flex-row items-center justify-center gap-2 rounded-md bg-black px-3 py-2 transition-all duration-200 ease-in-out xl:right-5 xl:top-20":
              true,
          },
          {
            "rounded-b-none": isExpanded,
          },
        )}
      >
        <button className="z-20" onClick={() => setIsExpanded(!isExpanded)}>
          <SettingsIcon
            className={cn(
              {
                "size-5 text-neutral-400 transition-all duration-200 ease-in-out":
                  true,
              },
              {
                "rotate-180": isExpanded,
              },
            )}
          />
        </button>

        <div
          className={cn(
            {
              "absolute top-[35px] flex h-[0px] w-full grow-0 flex-col items-center justify-start gap-5 overflow-hidden rounded-md rounded-t-none bg-black/50 backdrop-blur-sm transition-all duration-200 ease-in-out":
                true,
            },
            {
              "h-[90px]": isExpanded,
            },
          )}
        >
          <button
            onClick={() => {
              backgroundMusic.setHasErrored(true);
            }}
            className="mt-4 flex h-[20px] w-full shrink-0 flex-col items-center justify-center rounded-sm"
          >
            <Music className="size-5 text-white/50" />
          </button>
          <button
            onClick={() => {
              setShowDelete(true);
              animate.setQueue(true);
            }}
            className="flex h-[20px] w-full shrink-0 flex-col items-center justify-center rounded-sm"
          >
            <Trash2 className="size-5 text-red-500/50" />
          </button>
        </div>
      </div>
    </>
  );
}
