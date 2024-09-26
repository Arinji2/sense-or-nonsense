"use client";

import FighterModal from "@/modals/fighter-select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useAnimate from "../../../utils/useAnimate";
import { useFighterContext } from "./context";
import { FightersList } from "./fighters";
const scroll = 400;

function Scroll(
  scrollingDiv: React.MutableRefObject<HTMLDivElement | null>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
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
      scrollingDiv.current.scrollBy({
        left: scroll,
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
        left: -scroll,
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
  const router = useRouter();
  const animate = useAnimate(800);
  const { fighterData, isMultiplayer } = useFighterContext();

  const [documentDefined, setDocumentDefined] = useState(false);
  const [selectedFighterID, setSelectedFighterID] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setDocumentDefined(true);
  }, []);

  return (
    <>
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
              false,
            )}
            className="flex h-full w-14 flex-col items-center justify-center rounded-r-md bg-white/10 shadow-md shadow-black xl:w-20"
          >
            <ChevronLeft className="xl:size=16 size-10 text-black" />
          </button>
          <button
            disabled={clicked}
            onClick={Scroll.bind(null, scrollingDiv, clicked, setClicked, true)}
            className="flex h-full w-14 flex-col items-center justify-center rounded-l-md bg-white/10 shadow-md shadow-black xl:w-20"
          >
            <ChevronRight className="xl:size=16 size-10 text-black" />
          </button>
        </div>
        <div
          ref={scrollingDiv}
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory flex-row items-center justify-start gap-3 overflow-x-scroll rounded-md xl:max-w-[600px]"
        >
          {FightersList.map((fighter) => (
            <button
              onClick={async () => {
                setSelectedFighterID(fighter.id);
                animate.setQueue(true);
              }}
              key={fighter.id}
              style={{ "--fighterColor": fighter.color } as React.CSSProperties}
              className="to flex h-full w-full max-w-[800px] shrink-0 snap-center flex-col items-center justify-start bg-gradient-to-b from-[--fighterColor] from-60% py-14 pt-8 brightness-75 transition-all duration-300 ease-in-out hover:brightness-100 xl:py-16 xl:pt-10"
            >
              <div className="relative size-[200px] xl:size-[300px]">
                <Image
                  alt="Molly"
                  src={fighter.image}
                  fill
                  className=""
                  sizes="(min-width: 1280px) 300px, 200px"
                />
              </div>

              <div className="mt-auto flex h-fit w-full flex-col items-center justify-center gap-5 px-6">
                <h2 className="w-full truncate text-center text-[40px] font-semibold tracking-subtitle text-white xl:text-[60px]">
                  {fighter.name.toUpperCase()}
                </h2>
                <p className="line-clamp-3 text-center text-[20px] tracking-text text-white md:text-[25px]">
                  {fighter.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
