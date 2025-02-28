import { RoundSchemaType } from "../../../../../validations/pb/types";
import Rounds from "./items.client";

export default async function RoundStats({
  game,

  currentPlayerIndex,
}: {
  game: RoundSchemaType[];
  currentPlayerIndex: number;
}) {
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
