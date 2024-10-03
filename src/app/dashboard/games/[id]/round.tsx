import { LucideCheckCircle2, LucideXCircle } from "lucide-react";
import { NameFormat } from "../../../../../utils/formatting";
import { StringSearchParamType } from "../../../../../validations/generic/types";
import { RoundSchemaType } from "../../../../../validations/pb/types";
import { RoundSummaryHeaders } from "./round-summary.client";

export default async function RoundStats({
  game,
  searchParams,
  currentPlayerIndex,
}: {
  game: RoundSchemaType[];
  currentPlayerIndex: number;
  searchParams: {
    round: StringSearchParamType;
    word: StringSearchParamType;

    correct: StringSearchParamType;
    timeleft: StringSearchParamType;
  };
}) {
  if (searchParams.timeleft && !Array.isArray(searchParams.timeleft)) {
    game = game.sort((a, b) => b.time_elapsed - a.time_elapsed);
  }

  if (searchParams.round && !Array.isArray(searchParams.round))
    game = game.sort((a, b) => b.round_number - a.round_number);

  if (searchParams.correct) {
    if (Array.isArray(searchParams.correct)) return;
    const correct = game.filter((data) => data.correct);
    const incorrect = game.filter((data) => !data.correct);

    game = [...correct, ...incorrect];
  }

  if (searchParams.word && !Array.isArray(searchParams.word))
    game = game.sort((a, b) => {
      const aWord = (a.expand?.fake_word?.word ?? a.real_word)!;
      const bWord = (b.expand?.fake_word?.word ?? b.real_word)!;
      return bWord.localeCompare(aWord);
    });

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
              <RoundSummaryHeaders word="Selected" />
            </tr>
          </thead>
          <tbody>
            {game.map((data, index) => {
              if (data.player_index !== currentPlayerIndex) return;
              const word = (data.expand?.fake_word?.word ??
                data.expand?.real_word!.word)!;

              return (
                <tr key={index}>
                  <td className="px-2 py-2">{data.round_number}</td>
                  <td className="px-2 py-2">{data.time_elapsed}s</td>
                  <td className="w-[100px] px-2 py-2 xl:w-[150px]">
                    <div className="relative flex w-[100px] xl:w-[150px]">
                      <p className="w-full min-w-0 truncate text-center text-sm xl:w-[150px] xl:text-base">
                        {NameFormat(word)}
                      </p>
                    </div>
                  </td>
                  <td className="flex flex-col items-center justify-center px-2 py-2">
                    {data.correct ? (
                      <LucideCheckCircle2 className="size-[15px] text-green-500 xl:size-[15px]" />
                    ) : (
                      <LucideXCircle className="size-[15px] text-red-500 xl:size-[15px]" />
                    )}
                  </td>
                  <td className="w-[150px] px-2 py-2">
                    {data.correct
                      ? data.is_fake
                        ? "False"
                        : "True"
                      : data.is_fake
                        ? "True"
                        : "False"}
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
