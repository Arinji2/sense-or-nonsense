import { LucideCheckCircle2, LucideXCircle } from "lucide-react";
import { RoundsSchemaTypeWithWords } from "../../../../../validations/game-data/types";
import { StringSearchParamType } from "../../../../../validations/generic/types";
import { RoundSummaryHeaders } from "./round-summary.client";

export default async function RoundStats({
  game,
  searchParams,
  currentPlayerIndex,
}: {
  game: RoundsSchemaTypeWithWords[];
  currentPlayerIndex: number;
  searchParams: {
    round: StringSearchParamType;
    word: StringSearchParamType;

    correct: StringSearchParamType;
    timeleft: StringSearchParamType;
  };
}) {
  let gamesWithWords = [...game];

  if (searchParams.timeleft && !Array.isArray(searchParams.timeleft)) {
    gamesWithWords = gamesWithWords.sort(
      (a, b) => b.timeElapsed - a.timeElapsed,
    );
  }

  if (searchParams.round && !Array.isArray(searchParams.round))
    gamesWithWords = gamesWithWords.sort((a, b) => b.round - a.round);

  if (searchParams.correct) {
    if (Array.isArray(searchParams.correct)) return;
    const correct = gamesWithWords.filter((data) => data.isCorrect);
    const incorrect = gamesWithWords.filter((data) => !data.isCorrect);

    gamesWithWords = [...correct, ...incorrect];
  }

  if (searchParams.word && !Array.isArray(searchParams.word))
    gamesWithWords = gamesWithWords.sort((a, b) =>
      b.word.localeCompare(a.word),
    );

  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-10 rounded-sm bg-purple-500/10 py-6 xl:w-fit xl:px-10">
      <h2 className="text-center text-3xl font-bold tracking-subtitle text-white">
        DETAILED ROUND RESULTS
      </h2>
      <div className="no-scrollbar h-fit w-full overflow-x-auto">
        <table className="w-full max-w-[800px] rounded-sm text-center text-sm text-white">
          <thead>
            <tr>
              <RoundSummaryHeaders word="Round" />
              <RoundSummaryHeaders word="Time Left" />

              <RoundSummaryHeaders word="Word" />
              <RoundSummaryHeaders word="Correct" />
            </tr>
          </thead>
          <tbody>
            {gamesWithWords.map((data, index) => {
              if (data.playerIndex !== currentPlayerIndex) return;

              return (
                <tr key={index}>
                  <td className="px-2 py-2">{data.round}</td>
                  <td className="px-2 py-2">{data.timeElapsed}s</td>
                  <td className="w-[100px] px-2 py-2 xl:w-[150px]">
                    <div className="relative flex w-[100px] xl:w-[150px]">
                      <p className="w-full min-w-0 truncate text-center text-sm xl:w-[150px] xl:text-base">
                        {data.word}
                      </p>
                    </div>
                  </td>
                  <td className="flex flex-col items-center justify-center px-2 py-2">
                    {data.isCorrect ? (
                      <LucideCheckCircle2 className="size-[15px] text-green-500 xl:size-[15px]" />
                    ) : (
                      <LucideXCircle className="size-[15px] text-red-500 xl:size-[15px]" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
