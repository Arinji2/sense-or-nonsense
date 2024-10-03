import { StringSearchParamType } from "../../../../../validations/generic/types";
import { RoundSchemaType } from "../../../../../validations/pb/types";
import Rounds from "./items.client";

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
    <div className="flex h-fit w-full flex-col items-center justify-center gap-10 rounded-sm py-6">
      <h2 className="tracking-subtitle text-center text-3xl font-bold text-white">
        DETAILED ROUND RESULTS
      </h2>
      <Rounds
        rounds={game.filter((data) => data.player_index === currentPlayerIndex)}
      />
    </div>
  );
}
