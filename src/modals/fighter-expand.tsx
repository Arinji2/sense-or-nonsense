"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef } from "react";

import useAnimate from "../../utils/useAnimate";
import { FighterDataType } from "../../validations/generic/types";

export default function FighterExpand({
  Animate,
  fighterData,
}: {
  Animate: ReturnType<typeof useAnimate>;
  fighterData: FighterDataType;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const closeOpenMenus = useCallback(
    (e: any) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        Animate.setQueue(false);
      }
    },
    [Animate],
  );

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    function escHandler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeOpenMenus({});
      }
    }

    document.addEventListener("mousedown", closeOpenMenus);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "unset";
    };
  }, [Animate.showComponent, closeOpenMenus]);

  return (
    <>
      {Animate.actualState && (
        <div
          className={`${
            Animate.showComponent ? "opacity-100" : "opacity-0"
          } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
        >
          <div
            ref={containerRef}
            style={
              {
                "--fighterColor": fighterData.color,
              } as React.CSSProperties
            }
            className="group relative flex h-[80%] w-[80%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-neutral-800 px-6 py-3 md:h-[80%] md:w-[50%] xl:h-[400px] xl:w-[80%] xl:flex-row xl:gap-20 xl:px-10"
          >
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute right-8 top-8 hidden xl:block"
            >
              <X className="size-10 text-white" />
            </button>
            <div className="relative h-[40%] w-full xl:h-full xl:w-[30%]">
              <button
                aria-label="Close Modal"
                onClick={() => {
                  Animate.setQueue(false);
                }}
                className="absolute -right-3 top-8 z-20 block rounded-sm bg-black/30 p-2 xl:hidden"
              >
                <X className="size-5 text-white" />
              </button>
              <Image
                fill
                src={fighterData.image}
                alt="Login Image"
                className="h-full w-full shrink-0 object-contain brightness-[.6] transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75 xl:h-full"
                sizes="(min-width: 1280px) 500px, 80%"
                priority
              />
            </div>
            <div className="no-scrollbar flex h-full max-h-[300px] w-full flex-col items-start justify-start gap-5 overflow-y-auto xl:max-h-full xl:justify-center">
              <p className="text-center text-base font-bold tracking-title text-[--fighterColor] md:text-2xl xl:text-4xl">
                {fighterData.name}
              </p>
              <p className="max-w-[700px] text-left text-xs text-white/80 md:text-lg xl:text-base">
                <span className="text-[--fighterColor]">Short Lore:</span>{" "}
                {fighterData.lore.short}
              </p>
              <p className="max-w-[800px] text-left text-xss text-white/80 md:text-sm xl:text-base">
                <span className="text-[--fighterColor]">Long Lore:</span>{" "}
                {fighterData.lore.long}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
