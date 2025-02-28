"use client";

import FighterModal from "@/modals/fighter-select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/button";
import FighterExpand from "@/modals/fighter-expand";
import { FightersList } from "../../../constants/fighters";
import useAnimate from "../../../utils/useAnimate";
import { FighterDataType } from "../../../validations/generic/types";

function Scroll(
  scrollingDiv: React.MutableRefObject<HTMLDivElement | null>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  width: number,
  right?: boolean,
) {
  if (clicked) return;
  setClicked(true);

  if (!scrollingDiv.current) return;

  if (right) {
    if (
      Math.round(
        scrollingDiv.current.scrollLeft + scrollingDiv.current.clientWidth,
      ) === scrollingDiv.current.scrollWidth
    ) {
      scrollingDiv.current.scrollBy({
        left: scrollingDiv.current.scrollLeft * -1,
        behavior: "smooth",
      });
    } else {
      console;
      scrollingDiv.current.scrollBy({
        left: width,
        behavior: "smooth",
      });
    }
  } else {
    if (scrollingDiv.current.scrollLeft === 0) {
      scrollingDiv.current.scrollBy({
        left: scrollingDiv.current.scrollWidth,
        behavior: "smooth",
      });
    } else
      scrollingDiv.current.scrollBy({
        left: -width,
        behavior: "smooth",
      });
  }
  setTimeout(() => {
    setClicked(false);
  }, 500);
}

export default function Selector() {
  const scrollingDiv = useRef<HTMLDivElement | null>(null);
  const [clicked, setClicked] = useState(false);
  const animate = useAnimate(800);
  const [fighterExpand, setFighterExpand] = useState<FighterDataType | null>(
    null,
  );
  const expandAnimate = useAnimate(800);

  const [documentDefined, setDocumentDefined] = useState(false);
  const [selectedFighterID, setSelectedFighterID] = useState<number | null>(
    null,
  );
  const fighterDiv = useRef<HTMLDivElement | null>(null);
  const scrollWidth = useMemo(() => {
    return fighterDiv.current?.scrollWidth ?? 0;
  }, [fighterDiv]);

  useEffect(() => {
    setDocumentDefined(true);
  }, []);

  //listen for left and right arrow key presses
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        Scroll.bind(
          null,
          scrollingDiv,
          clicked,
          setClicked,
          scrollWidth,
          false,
        )();
      }
      if (event.key === "ArrowRight") {
        Scroll.bind(
          null,
          scrollingDiv,
          clicked,
          setClicked,
          scrollWidth,
          true,
        )();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clicked, scrollWidth]);

  return (
    <>
      {documentDefined &&
        fighterExpand &&
        createPortal(
          <FighterExpand Animate={expandAnimate} fighterData={fighterExpand} />,
          document.body,
        )}
      {documentDefined &&
        Number.isInteger(selectedFighterID) &&
        createPortal(
          <FighterModal Animate={animate} fighterID={selectedFighterID!} />,
          document.body,
        )}

      <div className="relative mb-4 h-[95%] w-[90%] xl:h-[90%] xl:w-full xl:max-w-[600px]">
        <div className="absolute left-[50%] top-[50%] z-50 flex h-14 w-full -translate-x-[50%] -translate-y-[50%] flex-row items-center justify-between rounded-full xl:top-[60%] xl:h-20">
          <button
            disabled={clicked}
            onClick={Scroll.bind(
              null,
              scrollingDiv,
              clicked,
              setClicked,
              scrollWidth,
              false,
            )}
            className="flex h-full w-10 flex-col items-center justify-center rounded-r-md bg-white/10 shadow-md shadow-black xl:w-16"
          >
            <ChevronLeft className="size-7 text-black xl:size-10" />
          </button>
          <button
            disabled={clicked}
            onClick={Scroll.bind(
              null,
              scrollingDiv,
              clicked,
              setClicked,
              scrollWidth,
              true,
            )}
            className="flex h-full w-10 flex-col items-center justify-center rounded-l-md bg-white/10 shadow-md shadow-black xl:w-16"
          >
            <ChevronRight className="size-7 text-black xl:size-10" />
          </button>
        </div>
        <div
          ref={scrollingDiv}
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory flex-row items-center justify-start gap-3 overflow-x-scroll rounded-md xl:max-w-[600px]"
        >
          {FightersList.map((fighter) => (
            <div
              ref={fighterDiv}
              key={fighter.id}
              style={{ "--fighterColor": fighter.color } as React.CSSProperties}
              className="to relative flex h-full w-full max-w-[800px] shrink-0 snap-center flex-col items-center justify-start gap-5 bg-gradient-to-b from-[--fighterColor] from-60% py-28 pt-8 brightness-75 transition-all duration-300 ease-in-out hover:brightness-100 xl:py-24 xl:pt-10"
            >
              <div className="relative size-[200px] xl:size-[250px]">
                <Image
                  alt={fighter.name}
                  src={fighter.image}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1280px) 250px, 200px"
                />
              </div>

              <div className="mt-auto flex h-fit w-full flex-col items-center justify-center gap-5 px-6">
                <h2 className="w-full truncate text-center text-base font-bold tracking-title text-white md:text-2xl xl:text-3xl">
                  {fighter.name.toUpperCase()}
                </h2>
                <p className="tracking-text line-clamp-3 text-center text-xs text-white/70 md:text-sm xl:max-w-[80%]">
                  {fighter.lore.short}
                </p>
              </div>
              <div className="absolute bottom-8 flex h-fit w-full flex-row items-center justify-center gap-4 xl:bottom-5">
                <Button
                  className="h-fit w-fit whitespace-nowrap bg-teal-500/40 text-[8px] text-white xl:text-sm"
                  onClick={async () => {
                    setSelectedFighterID(fighter.id);
                    animate.setQueue(true);
                  }}
                >
                  SELECT
                </Button>
                <Button
                  onClick={() => {
                    setFighterExpand(fighter);
                    expandAnimate.setQueue(true);
                  }}
                  className="h-fit w-fit whitespace-nowrap bg-white/40 text-[8px] text-white xl:text-sm"
                >
                  LEARN MORE
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
