"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "../../../../../utils/cn";
import { NameFormat } from "../../../../../utils/formatting";
import { RoundSchemaType } from "../../../../../validations/pb/types";

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

export default function Rounds({ rounds }: { rounds: RoundSchemaType[] }) {
  const [parent] = useAutoAnimate();
  return (
    <div
      ref={parent}
      className="flex h-fit w-full flex-col items-center justify-start gap-5 xl:gap-8"
    >
      {rounds.map((round, index) => {
        return <RoundItem key={index} round={round} index={index} />;
      })}
    </div>
  );
}

function RoundItem({
  index,
  round,
}: {
  index: number;
  round: RoundSchemaType;
}) {
  const color = useRef(`${getColor()}30`);
  const word =
    round.expand?.fake_word?.word ?? (round.expand?.real_word?.word as string);

  return (
    <Link
      href={`${round.is_fake ? "#" : `/dashboard/word-bank/${round.expand?.real_word?.id}`}`}
      tabIndex={round.is_fake ? -1 : 0}
      style={
        {
          "--color": color.current,
        } as React.CSSProperties
      }
      className={cn(
        "flex h-fit w-full shrink-0 flex-col items-start justify-end gap-3 rounded-md bg-[--color] p-4 px-8 shadow-md shadow-black xl:h-[100px] xl:flex-row xl:items-center xl:gap-8",
        {
          "cursor-text": round.is_fake,
        },
      )}
    >
      <h2 className="shrink-0 truncate text-lg font-bold tracking-number text-white md:text-xl xl:w-[70px]">
        {index + 1} .
      </h2>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 xl:h-full">
        <p className="mb-auto line-clamp-1 text-sm text-white/50">Word:</p>
        <p className="line-clamp-1 text-lg text-white">{NameFormat(word)}</p>
      </div>
      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-1/6">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">
          Time Taken:
        </p>
        <p className="line-clamp-1 text-sm text-white">
          {round.time_elapsed}
          <span className="text-white/50">s</span>
        </p>
      </div>
      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[10%]">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">
          Is Nonsense:
        </p>
        <p className="line-clamp-1 text-sm text-white">
          {round.is_fake ? "Yes" : "No"}
        </p>
      </div>
      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[10%]">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">Correct:</p>
        <p className="line-clamp-1 text-sm text-white">
          {round.correct ? "Yes" : "No"}
        </p>
      </div>
    </Link>
  );
}
