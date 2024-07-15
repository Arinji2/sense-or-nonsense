"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { FightersList } from "./fighters";
import { DecryptGameDataAction } from "../../../utils/game-data";
import { useRouter } from "next/navigation";
const scroll = 400;

function Scroll(
  scrollingDiv: React.MutableRefObject<HTMLDivElement | null>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  right?: boolean
) {
  if (clicked) return;
  setClicked(true);
  if (!scrollingDiv.current) return;

  if (right) {
    if (
      Math.round(
        scrollingDiv.current.scrollLeft + scrollingDiv.current.clientWidth
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

  return (
    <div className="w-[90%] xl:w-full xl:h-[90%] h-[95%] mb-4 relative xl:max-w-[600px] ">
      <div className="w-full flex flex-row items-center justify-between h-14 xl:h-20 rounded-full absolute top-[50%] xl:top-[60%] left-[50%] -translate-y-[50%] z-50 -translate-x-[50%]">
        <button
          disabled={clicked}
          onClick={Scroll.bind(null, scrollingDiv, clicked, setClicked, false)}
          className="h-full w-14 xl:w-20 rounded-r-md flex flex-col items-center justify-center bg-white/10 shadow-md shadow-black"
        >
          <ChevronLeft className="xl:size=16 size-10 text-black" />
        </button>
        <button
          disabled={clicked}
          onClick={Scroll.bind(null, scrollingDiv, clicked, setClicked, true)}
          className="h-full w-14 xl:w-20 rounded-l-md flex flex-col items-center justify-center bg-white/10 shadow-md shadow-black"
        >
          <ChevronRight className="xl:size=16 size-10 text-black" />
        </button>
      </div>
      <div
        ref={scrollingDiv}
        className="w-full xl:max-w-[600px] h-full rounded-md gap-3 no-scrollbar flex flex-row items-center justify-start overflow-x-scroll snap-x snap-mandatory"
      >
        {FightersList.map((fighter) => (
          <button
            onClick={async () => {
              const data = await DecryptGameDataAction();

              if (data.game_id && !Number.isInteger(data.game_id)) {
                router.push("/single");
              }
            }}
            key={fighter.id}
            style={{ "--fighterColor": fighter.color } as React.CSSProperties}
            className="w-full max-w-[800px] snap-center h-full brightness-75 hover:brightness-100 transition-all ease-in-out duration-300 shrink-0 bg-gradient-to-b from-[--fighterColor] to from-60%  flex flex-col items-center justify-start py-14 xl:py-16 pt-8 xl:pt-10"
          >
            <div className="xl:size-[300px] size-[200px] relative">
              <Image
                alt="Molly"
                src={fighter.image}
                fill
                className=""
                sizes="(min-width: 1280px) 300px, 200px"
              />
            </div>

            <div className="w-full h-fit mt-auto flex flex-col items-center justify-center gap-5 px-6">
              <h2 className="font-semibold tracking-subtitle text-white text-[40px] text-center xl:text-[60px] truncate w-full">
                {fighter.name.toUpperCase()}
              </h2>
              <p className="text-white tracking-text text-[25px] text-center line-clamp-3">
                {fighter.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
