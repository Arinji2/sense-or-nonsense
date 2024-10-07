import { NameFormat } from "../../../utils/formatting";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

export function RenderStats({
  CurrentRound,
  SelectedDifficulty,
  SelectedGame,
}: {
  CurrentRound: number;
  SelectedDifficulty: (typeof DifficultyList)[0];
  SelectedGame: (typeof GamesList)[0];
}) {
  return (
    <>
      <Stat
        title="Level"
        value={`${CurrentRound}/${SelectedDifficulty.rounds}`}
        id={1}
      />
      <Stat title="Difficulty" value={SelectedDifficulty.name} id={2} />
      <Stat title="Mode" value={NameFormat(SelectedGame.title)} id={3} />
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
