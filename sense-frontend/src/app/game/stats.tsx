import { NameFormat } from "../../../utils/formatting";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

export function RenderStats({
  currentRound,
  selectedDifficulty,
  selectedGame,
}: {
  currentRound: number;
  selectedDifficulty: (typeof DifficultyList)[0];
  selectedGame: (typeof GamesList)[0];
}) {
  return (
    <>
      <Stat
        title="Level"
        value={`${currentRound}/${selectedDifficulty.rounds}`}
        id={1}
      />
      <Stat title="Difficulty" value={selectedDifficulty.name} id={2} />
      <Stat title="Mode" value={NameFormat(selectedGame.title)} id={3} />
    </>
  );
}

function Stat({
  title,
  value,
  id,
}: {
  title: string;
  value: string;
  id: number;
}) {
  return (
    <div className="flex h-fit w-fit min-w-0 max-w-full flex-row items-center justify-start gap-2 opacity-80">
      <p className="text-sm font-bold text-[#FCAB3A] xl:text-lg">{id}.</p>
      <div className="flex h-fit w-full flex-col items-start justify-center gap-2">
        <p className="w-full truncate text-sm font-bold text-[#FCAB3A] xl:text-lg">
          {title}
        </p>
        <p className="-mt-2 w-full truncate text-sm font-bold text-white xl:text-lg">
          {value}
        </p>
      </div>
    </div>
  );
}
