"use client";

import { useTimerContext } from "@/app/game/context/timer-context";
import { Button } from "@/components/button";
import { Slider } from "@/components/slider";
import { Switch } from "@/components/switch";
import useLoading from "@/hooks/useLoading";
import {
  ChevronRight,
  Music,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MusicGif from "../../public/music.gif";
import { cn } from "../../utils/cn";
import useAnimate from "../../utils/useAnimate";
import {
  AudioHookReturn,
  SavedSoundSettingsSchemaType,
} from "../../validations/generic/types";

export default function AllowMusic({
  Animate,
  backgroundAudio,
  isCorrectAudio,
  isWrongAudio,
}: {
  Animate: ReturnType<typeof useAnimate>;
  backgroundAudio: AudioHookReturn;
  isCorrectAudio: AudioHookReturn;
  isWrongAudio: AudioHookReturn;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isBackgroundExpanded, setIsBackgroundExpanded] = useState(false);
  const [isSFXExpanded, setIsSFXExpanded] = useState(false);
  const { resetTimer } = useTimerContext();
  const { isGlobalLoading, startLoading } = useLoading();
  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [Animate.showComponent]);

  const router = useRouter();

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100" : "opacity-0"
        } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
      >
        <div
          ref={containerRef}
          className="group flex h-[90%] w-[90%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-custom-black md:h-[80%] xl:h-[600px] xl:w-[80%] xl:flex-row"
        >
          <div className="relative h-[40%] w-full overflow-hidden xl:h-full xl:w-[30%]">
            <Image
              fill
              unoptimized
              src={MusicGif}
              alt="In Progress"
              className="h-full w-full object-cover brightness-50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="relative flex h-fit w-full flex-col items-center justify-center gap-16 p-6 xl:h-full xl:w-[70%] xl:py-20">
            <div className="flex h-fit w-full flex-col items-center justify-center gap-3">
              <h4 className="tracking-subtitle text-center text-lg font-bold text-green-500 md:text-xl xl:text-2xl">
                {" "}
                AUDIO SETTINGS
              </h4>
              <p className="tracking-text text-center text-xss text-white/70 md:text-sm">
                This game will play sound effects, update settings as needed.
              </p>
            </div>
            <div className="flex h-[150px] w-full flex-col items-stretch justify-start overflow-y-auto xl:h-fit xl:flex-row xl:justify-center xl:overflow-y-visible">
              <div
                className={cn(
                  {
                    "flex h-[240px] w-full shrink-0 flex-col items-center justify-start gap-4 overflow-hidden border-b-4 border-white/10 pb-4 transition-all duration-500 ease-in-out xl:h-full xl:shrink xl:border-b-0 xl:border-r-2":
                      true,
                  },
                  {
                    "h-[35px] border-b-0 xl:h-full": !isBackgroundExpanded,
                  },
                )}
              >
                <button
                  aria-label="Expand Background Music"
                  onClick={() => setIsBackgroundExpanded(!isBackgroundExpanded)}
                  className="tracking-text flex h-[28px] flex-row items-center justify-center gap-1 font-bold text-white xl:h-fit"
                >
                  <ChevronRight
                    className={cn(
                      {
                        "rotate-90": !isBackgroundExpanded,
                      },
                      "inline size-5 text-[#FCAB3A] transition-all duration-500 ease-in-out xl:hidden",
                    )}
                  />
                  <h2 className="text-xs xl:text-sm">BACKGROUND MUSIC </h2>
                  <Music className="inline size-5 text-[#FCAB3A]" />
                </button>
                <div className="flex h-[34px] w-full flex-row items-center justify-center gap-2">
                  <button
                    disabled={backgroundAudio.isPlaying}
                    onClick={() => backgroundAudio.resume()}
                  >
                    <Play
                      className={cn(
                        { "size-6 text-green-500": true },
                        {
                          "text-neutral-500": backgroundAudio.isPlaying,
                        },
                      )}
                    />
                  </button>
                  <button
                    disabled={!backgroundAudio.isPlaying}
                    onClick={() => backgroundAudio.pause()}
                  >
                    <Pause
                      className={cn(
                        { "size-6 text-red-500": true },
                        {
                          "text-neutral-500": !backgroundAudio.isPlaying,
                        },
                      )}
                    />
                  </button>
                </div>
                <div className="flex h-fit w-fit shrink-0 flex-col items-center justify-center gap-2">
                  <p className="tracking-text text-center text-xs text-white md:text-sm">
                    Adjust Volume
                  </p>
                  <div className="flex h-fit w-full flex-row items-center justify-center gap-2">
                    {backgroundAudio.volume === 0 ? (
                      <VolumeX className="size-6 text-white" />
                    ) : (
                      <Volume2 className="size-6 text-white" />
                    )}
                    <Slider
                      defaultValue={[backgroundAudio.volume]}
                      onValueChange={(value) =>
                        backgroundAudio.setVolume(value[0])
                      }
                      step={0.1}
                      min={0}
                      max={1}
                      className="h-fit w-full"
                    />
                  </div>
                </div>
                <div className="flex h-fit w-fit shrink-0 flex-col items-center justify-center gap-2">
                  <p className="tracking-text text-center text-xs text-white md:text-sm">
                    Disable Music
                  </p>
                  <div className="flex h-fit w-fit flex-row items-center justify-center gap-2">
                    <Switch
                      defaultChecked={!backgroundAudio.isEnabled}
                      onCheckedChange={(value) => {
                        backgroundAudio.setIsEnabled(!value);
                        if (value) {
                          backgroundAudio.pause();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  {
                    "flex h-[300px] w-full shrink-0 flex-col items-center justify-start gap-4 overflow-hidden border-t-4 border-white/10 pt-4 transition-all duration-500 ease-in-out xl:h-full xl:shrink xl:border-l-2 xl:border-t-0 xl:pt-0":
                      true,
                  },
                  {
                    "h-[35px] border-t-0 xl:h-full": !isSFXExpanded,
                  },
                )}
              >
                <button
                  aria-label="Expand SFX"
                  onClick={() => setIsSFXExpanded(!isSFXExpanded)}
                  className="tracking-text flex h-[28px] flex-row items-center justify-center gap-1 font-bold text-white xl:h-fit"
                >
                  <ChevronRight
                    className={cn(
                      {
                        "rotate-90": !isSFXExpanded,
                      },
                      "inline size-5 text-[#FCAB3A] transition-all duration-500 ease-in-out xl:hidden",
                    )}
                  />
                  <h2 className="text-xs xl:text-sm">GAME SFX </h2>
                  <Music2 className="inline size-5 text-[#FCAB3A]" />
                </button>
                <div className="flex h-fit w-fit flex-col items-center justify-center gap-4 px-4 xl:px-0">
                  <Button
                    disabled={!isCorrectAudio.isEnabled}
                    onClick={async () => {
                      if (isCorrectAudio.isPlaying) return;
                      isCorrectAudio.play();
                    }}
                    className="w-full whitespace-nowrap bg-green-500/60 text-xs text-white xl:text-xs"
                  >
                    Correct Choice
                  </Button>
                  <Button
                    disabled={!isWrongAudio.isEnabled}
                    onClick={async () => {
                      if (isWrongAudio.isPlaying) return;
                      isWrongAudio.play();
                    }}
                    className="w-full whitespace-nowrap bg-red-500/60 text-xs text-white xl:text-xs"
                  >
                    Incorrect Choice
                  </Button>
                </div>
                <div className="flex h-fit w-fit flex-col items-center justify-center gap-2">
                  <p className="tracking-text text-center text-xs text-white md:text-sm">
                    Adjust Volume
                  </p>
                  <div className="flex h-fit w-full flex-row items-center justify-center gap-2">
                    {isCorrectAudio.volume === 0 ? (
                      <VolumeX className="size-6 text-white" />
                    ) : (
                      <Volume2 className="size-6 text-white" />
                    )}
                    <Slider
                      defaultValue={[isCorrectAudio.volume]}
                      onValueChange={(value) => {
                        isCorrectAudio.setVolume(value[0]);
                        isWrongAudio.setVolume(value[0]);
                      }}
                      step={0.1}
                      min={0}
                      max={1}
                      className="h-fit w-full"
                    />
                  </div>
                </div>

                <div className="flex h-fit w-fit flex-col items-center justify-center gap-2">
                  <p className="tracking-text text-center text-xs text-white md:text-sm">
                    Disable SFX
                  </p>
                  <div className="flex h-fit w-fit flex-row items-center justify-center gap-2">
                    <Switch
                      defaultChecked={!isCorrectAudio.isEnabled}
                      onCheckedChange={(value) => {
                        isCorrectAudio.setIsEnabled(!value);
                        isWrongAudio.setIsEnabled(!value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-fit w-fit shrink-0 flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
              <Button
                disabled={isGlobalLoading}
                onClick={async () => {
                  startLoading(() => {
                    Animate.setQueue(false);
                    backgroundAudio.setHasErrored(false);

                    localStorage.setItem(
                      "backgroundMusicSettings",
                      JSON.stringify({
                        volume: backgroundAudio.volume,
                        isEnabled: backgroundAudio.isEnabled,
                      } as SavedSoundSettingsSchemaType),
                    );

                    localStorage.setItem(
                      "sfxSoundSettings",
                      JSON.stringify({
                        volume: isCorrectAudio.volume,
                        isEnabled: isCorrectAudio.isEnabled,
                      } as SavedSoundSettingsSchemaType),
                    );

                    if (
                      !backgroundAudio.isPlaying &&
                      backgroundAudio.isEnabled
                    ) {
                      backgroundAudio.play();
                    }
                    router.refresh();
                    resetTimer();
                  });
                }}
                className="w-full whitespace-nowrap bg-purple-500/60 text-xs text-white xl:text-xs"
              >
                LETS GO!
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
