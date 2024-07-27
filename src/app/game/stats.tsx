import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

export function RenderStats({
  CurrentRound,
  SelectedDifficulty,
  SelectedPlayer,
  fighter_data,
  SelectedGame,
  CurrentStreaks,
}: {
  CurrentRound: number;
  SelectedDifficulty: (typeof DifficultyList)[0];
  SelectedPlayer: GameFighterSchemaType;
  fighter_data: GameFighterSchemaType[];
  SelectedGame: (typeof GamesList)[0];
  CurrentStreaks: { [key: number]: number };
}) {
  return (
    <>
      <Stat
        title="Level"
        value={`${CurrentRound}/${SelectedDifficulty.rounds}`}
        id={1}
      />
      <Stat title="Difficulty" value={SelectedDifficulty.name} id={2} />
      <Stat title="Player" value={SelectedPlayer.fighter_name} id={3} />
      {SelectedGame.isMultiplayer ? (
        <>
          {fighter_data.map((fighter, index) => (
            <Stat
              key={index}
              title={`${fighter.fighter_name} Streak`}
              value={CurrentStreaks[index].toString()}
              id={index + 4}
            />
          ))}
        </>
      ) : (
        <Stat title="Streak" value={CurrentStreaks[0].toString()} id={4} />
      )}
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
  let updatedTitle = title;

  updatedTitle =
    updatedTitle.length > 20 ? updatedTitle.slice(0, 20) + "..." : updatedTitle;
  return (
    <div className="flex h-fit w-fit min-w-0 max-w-full flex-row items-center justify-start gap-2 xl:max-w-[150px]">
      <p className="text-2xl font-bold text-[#FCAB3A]">{id}.</p>
      <div className="flex h-fit w-full flex-col items-start justify-center">
        <p className="w-full truncate text-2xl font-bold text-[#FCAB3A]">
          {title}
        </p>
        <p className="-mt-2 w-full truncate text-2xl font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
