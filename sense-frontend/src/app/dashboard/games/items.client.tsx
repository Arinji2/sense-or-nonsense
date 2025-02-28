"use client";

import { GamesList } from "@/app/games";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useRef } from "react";
import { FormatDate1 } from "../../../../utils/formatting";
import { GamesDataType } from "../../../../validations/generic/types";
import { GameSchemaType } from "../../../../validations/pb/types";

function getColor() {
  const colors = [
    "#f97316", // orange-500
    "#a855f7", // purple-500
    "#ec4899", // pink-500
    "#8b5cf6", // violet-500
    "#3b82f6", // blue-500
    "#06b6d4", // cyan-500
    "#10b981", // emerald-500
    "#14b8a6", // teal-500
    "#ef4444", // red-500
    "#6366f1", // indigo-500
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

export default function Games({ games }: { games: GameSchemaType[] }) {
  const [parent] = useAutoAnimate();
  return (
    <div
      ref={parent}
      className="flex h-fit w-full flex-col items-center justify-start gap-5 xl:gap-8"
    >
      {games.map((game, index) => {
        const selectedGame = GamesList.find(
          (gameList) => gameList.id.toString() === game.gameID,
        );
        if (selectedGame === undefined) return null;
        return (
          <GameItem
            key={index}
            game={game}
            index={index}
            selectedGame={selectedGame}
          />
        );
      })}
    </div>
  );
}

function GameItem({
  index,
  game,
  selectedGame,
}: {
  index: number;
  game: GameSchemaType;
  selectedGame: GamesDataType;
}) {
  const color = useRef(`${getColor()}30`);

  return (
    <div
      style={
        {
          "--color": color.current,
        } as React.CSSProperties
      }
      className="flex h-fit w-full shrink-0 flex-col items-start justify-end gap-3 rounded-md bg-[--color] p-4 px-8 shadow-md shadow-black xl:h-[100px] xl:flex-row xl:items-center xl:gap-8"
    >
      <h2 className="shrink-0 truncate text-lg font-bold tracking-number text-white md:text-xl xl:w-[70px]">
        {index + 1} .
      </h2>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 xl:h-full">
        <p className="mb-auto line-clamp-1 text-sm text-white/50">Type:</p>
        <p className="line-clamp-1 text-lg text-white">{selectedGame.title}</p>
      </div>
      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[5%]">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">Level:</p>
        <p className="line-clamp-1 text-sm text-white">{game.difficulty}</p>
      </div>

      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-1/6">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">
          Attempted On:
        </p>
        <p className="line-clamp-1 text-sm text-white">
          {FormatDate1(game.created)}
        </p>
      </div>
      <Link
        href={`/dashboard/games/${game.id}?anaylisis=true`}
        className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-5 py-2 text-center leading-tight text-white shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-fit"
      >
        View
      </Link>
    </div>
  );
}
