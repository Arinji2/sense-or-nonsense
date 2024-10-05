"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FightersList } from "../../../constants/fighters";
import { cn } from "../../../utils/cn";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { CurrentStreaks } from "../../../validations/generic/types";

export default function PlayerView({
  playerData,
  currentPlayer,
  CurrentStreaks,
  className,
}: {
  playerData: GameFighterSchemaType[];
  currentPlayer: number;
  CurrentStreaks: CurrentStreaks;
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const upcomingPlayers = useMemo(() => {
    const nextPlayers = playerData.slice(currentPlayer + 1);
    const wrappedPlayers = playerData.slice(0, currentPlayer);
    return [...nextPlayers, ...wrappedPlayers];
  }, [playerData, currentPlayer]);

  const [parent] = useAutoAnimate();

  return (
    <div
      style={
        {
          "--playerColor":
            FightersList[playerData[currentPlayer].fighter_id].color,
        } as React.CSSProperties
      }
      className={cn(
        "absolute bottom-4 z-30 flex h-[120px] w-[250px] flex-col items-center justify-start rounded-md bg-[#1E1E1E] px-4 py-2 shadow-md shadow-black xl:left-10 xl:top-10 xl:h-[150px]",
        {
          "xl:h-[125px]": playerData.length === 1,
        },
        className,
      )}
    >
      <div className="flex h-[40px] w-full shrink-0 flex-row items-center justify-between">
        <h1 className="text-center text-xss font-bold tracking-wide text-white">
          Currently Playing
        </h1>
        <p className="text-base font-bold text-[--playerColor]">
          P{currentPlayer + 1}
        </p>
      </div>
      <div className="flex h-full w-full flex-row items-start justify-end gap-4">
        <div className="x:size-[80px] relative z-20 size-[40px] shrink-0">
          <Image
            alt={FightersList[playerData[currentPlayer].fighter_id].name}
            src={FightersList[playerData[currentPlayer].fighter_id].image}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex h-fit w-full flex-col items-start justify-start">
          <p className="line-clamp-2 text-sm text-white">
            {playerData[currentPlayer].fighter_name} Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Modi commodi cum eos doloribus dicta
            officia libero maiores inventore sit nesciunt.
          </p>
          <p className="text-xss font-medium text-white/60">
            Streak:{" "}
            <span className="text-[--playerColor]">
              {CurrentStreaks[playerData[currentPlayer].fighter_uid] ?? 0}
            </span>
          </p>
        </div>
      </div>
      {playerData.length > 1 && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute bottom-2 right-2 hidden w-fit flex-row items-center justify-center gap-1 xl:flex"
        >
          <p className="text-[10px] tracking-wide text-white">
            View All Players
          </p>
          <ChevronDown
            className={cn(
              "size-5 text-[--playerColor] transition-all duration-500 ease-in-out",
              {
                "rotate-180": isOpen,
                "rotate-0": !isOpen,
              },
            )}
            strokeWidth={2}
          />
        </button>
      )}
      <div
        className={cn(
          "absolute top-[105%] w-full shrink-0 overflow-hidden rounded-md bg-[#1E1E1E] shadow-md shadow-black transition-all duration-500 ease-in-out",
          {
            "h-[300px]": isOpen,
            "h-[0px]": !isOpen,
          },
        )}
      >
        <div
          ref={parent}
          className="no-scrollbar flex h-full w-full flex-col items-center justify-start gap-3 overflow-y-auto overflow-x-hidden p-4"
        >
          {upcomingPlayers.map((player, index) => {
            const playerNumber = playerData.findIndex(
              (p) => p.fighter_id === player.fighter_id,
            );
            return (
              <div
                key={player.fighter_id}
                style={
                  {
                    "--innerPlayerColor": FightersList[player.fighter_id].color,
                    "--lighterInnerPlayerColor":
                      FightersList[player.fighter_id].color + "40",
                  } as React.CSSProperties
                }
                className="bottom-4 z-30 flex h-[100px] w-full shrink-0 flex-col items-center justify-start gap-6 rounded-md bg-[--lighterInnerPlayerColor] p-4 xl:h-[150px]"
              >
                <div className="flex h-[40px] w-full shrink-0 flex-row items-center justify-between">
                  <h1 className="tracking-text text-left text-xss font-bold text-white">
                    Playing in <br /> {index + 1}{" "}
                    {index + 1 > 1 ? "Rounds" : "Round"}
                  </h1>
                  <p className="text-sm font-bold text-[--innerPlayerColor]">
                    P{playerNumber + 1}
                  </p>
                </div>
                <div className="flex h-full w-full flex-row items-start justify-between gap-4">
                  <div className="relative size-[40px] shrink-0 xl:size-[60px]">
                    <Image
                      alt={FightersList[player.fighter_id].name}
                      src={FightersList[player.fighter_id].image}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex h-fit w-[100px] flex-col items-start justify-start">
                    <p className="line-clamp-2 w-full text-xs text-white">
                      {player.fighter_name}
                    </p>
                    <p className="text-xs text-white/60">
                      Streak:{" "}
                      <span className="text-[--innerPlayerColor]">
                        {CurrentStreaks[player.fighter_uid] ?? 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
