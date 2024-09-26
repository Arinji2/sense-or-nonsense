"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { cn } from "../../../utils/cn";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { CurrentStreaks } from "../../../validations/generic/types";
import { FightersList } from "../fighters/fighters";

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

  // Reorder players based on their upcoming turns
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
        "absolute bottom-4 z-30 flex h-[100px] w-[250px] flex-col items-center justify-start rounded-md bg-[#1E1E1E] px-4 py-2 shadow-md shadow-black md:left-10 md:top-10 md:h-[150px]",
        className,
      )}
    >
      {/* Current player view remains the same */}
      <div className="flex h-[40px] w-full shrink-0 flex-row items-center justify-between">
        <h1 className="text-center text-[15px] font-bold tracking-text text-white">
          Currently Playing
        </h1>
        <p className="text-[20px] font-bold text-[--playerColor]">
          P{currentPlayer + 1}
        </p>
      </div>
      <div className="flex h-full w-full flex-row items-start justify-end gap-4">
        <div className="relative size-[40px] shrink-0 md:size-[80px]">
          <Image
            alt={FightersList[playerData[currentPlayer].fighter_id].name}
            src={
              FightersList[playerData[currentPlayer].fighter_id]
                .transparentImage
            }
            fill
            className="object-contain"
          />
        </div>
        <div className="flex h-fit w-full flex-col items-start justify-start">
          <p className="line-clamp-2 text-[18px] text-white">
            {playerData[currentPlayer].fighter_name}
          </p>
          <p className="text-[15px] font-medium text-white/60">
            Streak:{" "}
            <span className="text-[--playerColor]">
              {CurrentStreaks[currentPlayer]}
            </span>
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-2 right-2 hidden w-fit flex-row items-center justify-center gap-1 md:flex"
      >
        <p className="text-[10px] tracking-wide text-white">View All Players</p>
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
                className="bottom-4 z-30 flex h-[100px] w-full shrink-0 flex-col items-center justify-start gap-6 rounded-md bg-[--lighterInnerPlayerColor] p-4 md:h-[150px]"
              >
                <div className="flex h-[40px] w-full shrink-0 flex-row items-center justify-between">
                  <h1 className="text-left text-[15px] font-bold tracking-text text-white">
                    Playing in <br /> {index + 1}{" "}
                    {index + 1 > 1 ? "Rounds" : "Round"}
                  </h1>
                  <p className="text-[20px] font-bold text-[--innerPlayerColor]">
                    P{playerNumber + 1}
                  </p>
                </div>
                <div className="flex h-full w-full flex-row items-start justify-end gap-4">
                  <div className="relative size-[40px] shrink-0 md:size-[60px]">
                    <Image
                      alt={FightersList[player.fighter_id].name}
                      src={FightersList[player.fighter_id].transparentImage}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex h-fit w-full flex-col items-start justify-start">
                    <p className="line-clamp-2 text-[15px] text-white">
                      {player.fighter_name}
                    </p>
                    <p className="text-[12px] font-medium text-white/60">
                      Streak:{" "}
                      <span className="text-[--innerPlayerColor]">
                        {CurrentStreaks[player.fighter_id]}
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
