import { Button } from "@/components/button";
import Link from "next/link";
import React from "react";
import { FormatDate1, NameFormat } from "../../../../utils/formatting";
import { GetUserMode } from "../../../../utils/getMode";
import { RoundSchema } from "../../../../validations/pb/schema";
import Pagination from "./pagination.client";

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

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page: string | string[] | undefined;
  };
}) {
  const { mode, pb, userID } = await GetUserMode();
  let pageNumber = 1;
  if (searchParams.page && !Array.isArray(searchParams.page)) {
    pageNumber = parseInt(searchParams.page);
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }
  }

  const wordsRecord = await pb.collection("rounds").getList(pageNumber, 10, {
    filter: `game.user = "${userID}" && is_fake = false && real_word != ""`,
    expand: "real_word,game",
  });

  const parsedWords = wordsRecord.items
    .map((word) => {
      const parse = RoundSchema.safeParse(word);
      if (parse.success) {
        return parse.data;
      }
      return null;
    })
    .filter((word) => word !== null);

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E]">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-5 px-4 py-5 xl:px-0 xl:py-10"
      >
        <h1 className="text-base font-bold leading-relaxed tracking-title text-white md:text-xl">
          <Link
            href="/dashboard"
            className="block text-white/50 md:inline xl:text-lg"
          >
            DASHBOARD
          </Link>
          /WORD BANK
        </h1>

        <p className="pb-5 text-sm text-white/70">
          This is the word bank, it contains all the correct words you have
          encountered throughout your games.{" "}
        </p>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="flex h-full w-full flex-col items-center justify-start gap-10"
        >
          {parsedWords.map((word, index) => {
            return (
              <div
                key={word.id}
                style={
                  {
                    "--color": getColor() + "30",
                  } as React.CSSProperties
                }
                className="flex h-fit w-full shrink-0 flex-col items-start justify-end gap-3 rounded-md bg-[--color] p-4 px-8 shadow-md shadow-black xl:h-[100px] xl:flex-row xl:items-center xl:gap-8"
              >
                <h2 className="shrink-0 truncate text-lg font-bold tracking-number text-white md:text-xl xl:w-[70px]">
                  {index + 1} .
                </h2>
                <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 xl:h-full">
                  <p className="mb-auto line-clamp-1 text-sm text-white/50">
                    Word:
                  </p>
                  <p className="line-clamp-1 text-lg text-white">
                    {NameFormat(word.expand?.real_word?.word!)}
                  </p>
                </div>
                <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[5%]">
                  <p className="mb-auto line-clamp-1 text-xs text-white/50">
                    Level:
                  </p>
                  <p className="line-clamp-1 text-sm text-white">
                    {word.expand?.game?.difficulty}
                  </p>
                </div>
                <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-[15%]">
                  <p className="mb-auto line-clamp-1 text-xs text-white/50">
                    Option Chosen:
                  </p>
                  <p className="line-clamp-1 text-sm text-white">
                    {word.correct ? "Sense" : "Nonsense"}
                  </p>
                </div>
                <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-2 py-2 xl:h-full xl:w-1/6">
                  <p className="mb-auto line-clamp-1 text-xs text-white/50">
                    Attempted On:
                  </p>
                  <p className="line-clamp-1 text-sm text-white">
                    {FormatDate1(word.created)}
                  </p>
                </div>
                <Button className="w-full shrink-0 bg-green-500/40 px-4 py-2 text-xs text-white md:text-sm xl:w-fit">
                  View
                </Button>
              </div>
            );
          })}
          <Pagination
            pageNumber={pageNumber}
            totalPages={wordsRecord.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
