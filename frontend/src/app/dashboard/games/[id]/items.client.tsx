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
  let word =
    round.expand?.fake_word?.word ??
    (round.expand?.real_word?.word as string) ??
    "Unknown";

  let status =
    word === "Unknown"
      ? "unknown"
      : round.is_fake
        ? "fake"
        : ("real" as "fake" | "real" | "unknown");

  if (status === "unknown") {
    word = "Unknown";
    round.time_elapsed = 0;
    round.correct = false;
    round.is_fake = false;
    status = "fake";
  }

  return (
    <WordWrapper
      status={status}
      realID={round.expand?.real_word?.id!}
      color={color.current}
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
          {word === "Unknown" ? "-" : round.is_fake ? "Yes" : "No"}
        </p>
      </div>
      <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[10%]">
        <p className="mb-auto line-clamp-1 text-xs text-white/50">Correct:</p>
        <p className="line-clamp-1 text-sm text-white">
          {word === "Unknown" ? "-" : round.correct ? "Yes" : "No"}
        </p>
      </div>
    </WordWrapper>
  );
}

function WordWrapper({
  status,
  children,
  realID,
  color,
}: {
  status: "fake" | "real" | "unknown";
  children: React.ReactNode;
  realID: string;
  color: string;
}) {
  if (status === "real") {
    return (
      <Link
        href={`/dashboard/word-bank/${realID}`}
        style={
          {
            "--color": color,
          } as React.CSSProperties
        }
        className={cn(
          "flex h-fit w-full shrink-0 scale-95 flex-col items-start justify-end gap-3 rounded-md bg-[--color] p-4 px-8 shadow-md shadow-black transition-all duration-300 ease-in-out will-change-transform hover:scale-100 xl:h-[100px] xl:flex-row xl:items-center xl:gap-8",
        )}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <div
        style={
          {
            "--color": color,
          } as React.CSSProperties
        }
        className={cn(
          "flex h-fit w-full shrink-0 scale-95 flex-col items-start justify-end gap-3 rounded-md bg-[--color] p-4 px-8 shadow-md shadow-black xl:h-[100px] xl:flex-row xl:items-center xl:gap-8",
        )}
      >
        {children}
      </div>
    );
  }
}
