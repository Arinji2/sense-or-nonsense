import { GamesList } from "@/app/games";
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
  GameData: (typeof GamesList)[0];
  scoreData?: ScoreSchemaType;
  multi?: boolean;
}) {
  return (
    <div className="group relative flex w-full shrink-0 grow snap-center flex-col items-start justify-center overflow-hidden rounded-md xl:h-[95%]">
      <Image
        className={cn(
          {
            "absolute left-0 top-0 object-cover blur-sm brightness-[0.3] transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-[0.4]":
              true,
          },
          { "object-left": GameData.showLeft },
        )}
        src={GameData.image}
        alt={GameData.description}
        fill
      />
      <div className="z-20 flex h-full w-full flex-col items-start justify-start gap-10 rounded-r-md bg-black/60 px-5 py-4 pt-32 md:h-full md:w-fit md:px-10 md:pt-10 xl:justify-end">
        <h2 className="text-[25px] font-bold tracking-text text-[#DE6A38] md:text-[50px]">
          {GameData.title}
        </h2>
        <p className="text-[15px] font-medium tracking-text text-white md:text-[20px]">
          {GameData.description}
        </p>
        <div className="flex h-fit w-full flex-col items-start justify-start gap-5">
          <h3 className="text-[20px] font-bold text-white md:text-[30px]">
            {GameData.showTime ? "" : "HIGH SCORES"}
          </h3>
          <div className="flex h-fit w-full flex-row flex-wrap items-center justify-start gap-10">
            {GameData.showTime ? (
              <div className="flex h-fit w-fit flex-col items-start justify-start gap-1">
                <h4 className="text-[15px] font-bold text-[#FCAB3A] md:text-[30px]">
                  LAST PLAYED:
                </h4>
                <p className="text-[15px] font-bold text-white md:text-[30px]">
                  {scoreData ? FormatDate1(scoreData.updated) : "Never"}
                </p>
              </div>
            ) : (
              modes.map((mode, index) => (
                <div
                  key={index}
                  className="flex h-fit w-fit flex-row items-center justify-center gap-3"
                >
                  <p className="text-[20px] font-bold text-[#FCAB3A] md:text-[50px]">
                    {index + 1}.
                  </p>
                  <div className="flex h-fit w-fit flex-col items-start justify-start gap-1">
                    <h4 className="text-[15px] font-bold text-[#FCAB3A] md:text-[30px]">
                      {mode.toUpperCase()}
                    </h4>
                    <p className="text-[15px] font-bold text-white md:text-[30px]">
                      {scoreData ? scoreData[mode] : 0}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-auto flex h-fit w-full flex-row flex-wrap items-center justify-start gap-5 xl:mt-0">
          <PlayNowButton gameData={GameData} />
          <Link
            href={multi ? "/single" : "/multi"}
            className="shrink-0 rounded-sm bg-blue-500 p-2 px-4 text-[15px] text-white transition-all duration-200 ease-in-out hover:bg-blue-600"
          >
            PLAY {multi ? "SINGLE PLAYER" : "MULTIPLAYER"}
          </Link>
        </div>
      </div>
    </div>
  );
}
