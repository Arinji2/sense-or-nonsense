import GAMEDATA from "@/app/games";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../../../utils/cn";
import { FormatDate1 } from "../../../utils/formatDate";
import { ScoreSchemaType } from "../../../validations/scores/types";
import PlayNowButton from "./button.client";

const modes: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

export function GameComponent({
  GameData,
  scoreData,
  multi,
}: {
  GameData: (typeof GAMEDATA)[0];
  scoreData?: ScoreSchemaType;
  multi?: boolean;
}) {
  return (
    <div className="w-full rounded-md group  relative flex flex-col items-start justify-center grow snap-center shrink-0 overflow-hidden xl:h-[95%]">
      <Image
        className={cn(
          {
            "object-cover absolute group-hover:brightness-[0.4] transition-all ease-in-out duration-700 group-hover:scale-105 brightness-[0.3] blur-sm top-0 left-0 ":
              true,
          },
          { "object-left": GameData.showLeft }
        )}
        src={GameData.image}
        alt={GameData.description}
        fill
      />
      <div className=" w-full px-5 md:h-full md:w-fit flex flex-col bg-black/60 rounded-r-md  items-start gap-10 pt-32 md:pt-10  md:px-10 py-4 justify-start xl:justify-end  z-20 h-full">
        <h2 className="text-[#DE6A38] font-bold tracking-text text-[25px] md:text-[50px]">
          {GameData.title}
        </h2>
        <p className="text-[15px] md:text-[20px] text-white font-medium tracking-text">
          {GameData.description}
        </p>
        <div className="w-full h-fit gap-5 flex flex-col items-start justify-start">
          <h3 className="text-[20px] md:text-[30px] font-bold text-white">
            {GameData.showTime ? "" : "HIGH SCORES"}
          </h3>
          <div className="w-full h-fit flex flex-row flex-wrap items-center justify-start gap-10">
            {GameData.showTime ? (
              <div className="w-fit h-fit flex flex-col items-start justify-start gap-1">
                <h4 className="font-bold  text-[15px] md:text-[30px] text-[#FCAB3A]">
                  LAST PLAYED:
                </h4>
                <p className="font-bold  text-[15px] md:text-[30px] text-white">
                  {scoreData ? FormatDate1(scoreData.updated) : "Never"}
                </p>
              </div>
            ) : (
              modes.map((mode, index) => (
                <div
                  key={index}
                  className="w-fit h-fit flex flex-row items-center justify-center gap-3"
                >
                  <p className="font-bold text-[20px] md:text-[50px] text-[#FCAB3A]">
                    {index + 1}.
                  </p>
                  <div className="w-fit h-fit flex flex-col items-start justify-start gap-1">
                    <h4 className="font-bold  text-[15px] md:text-[30px] text-[#FCAB3A]">
                      {mode.toUpperCase()}
                    </h4>
                    <p className="font-bold  text-[15px] md:text-[30px] text-white">
                      {scoreData ? scoreData[mode] : 0}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-5 mt-auto xl:mt-0 flex-wrap">
          <PlayNowButton gameData={GameData} />
          <Link
            href={multi ? "/single" : "/multi"}
            className="text-white text-[15px] shrink-0 hover:bg-blue-600 transition-all ease-in-out duration-200 bg-blue-500 p-2 px-4 rounded-sm"
          >
            PLAY {multi ? "SINGLE PLAYER" : "MULTIPLAYER"}
          </Link>
        </div>
      </div>
    </div>
  );
}
