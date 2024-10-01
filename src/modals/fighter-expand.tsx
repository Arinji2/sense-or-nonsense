"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", closeOpenMenus);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Animate.showComponent]);

  const closeOpenMenus = (e: any) => {
    if (
      containerRef.current &&
      Animate.showComponent &&
      !containerRef.current.contains(e.target)
    ) {
      Animate.setQueue(false);
    }
  };

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
                "--fighterColor":
                  fighterData.secondaryColor ?? fighterData.color,
              } as React.CSSProperties
            }
            className="group relative flex h-[80%] w-[70%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-[--fighterColor] px-10 py-3 md:h-[80%] md:w-[50%] xl:h-[400px] xl:w-[80%] xl:flex-row xl:gap-20"
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
                src={fighterData.transparentImage}
                alt="Login Image"
                className="h-full w-full shrink-0 object-contain brightness-[.6] transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75 xl:h-full"
                sizes="(min-width: 1280px) 500px, 80%"
                priority
              />
            </div>
            <div className="flex h-full max-h-[300px] w-full flex-col items-start justify-start gap-5 overflow-y-auto xl:max-h-full xl:justify-center">
              <p className="text-center text-base font-bold tracking-title text-white md:text-2xl xl:text-4xl">
                {fighterData.name}
              </p>
              <p className="max-w-[700px] text-left text-xs text-white/50 md:text-lg xl:text-base">
                <span className="text-white">Short Lore:</span>{" "}
                {fighterData.lore.short}
              </p>
              <p className="max-w-[800px] text-left text-xss text-white/50 md:text-sm xl:text-base">
                <span className="text-white">Long Lore:</span>{" "}
                {fighterData.lore.long}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
