import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { CurrentGameStreaks } from "../../../validations/generic/types";
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
  CurrentStreaks: CurrentGameStreaks;
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
      {SelectedGame.isMultiplayer && typeof CurrentStreaks !== "number" ? (
        <>
          <Stat
            title={`${fighter_data[0].fighter_name} Streak`}
            value={CurrentStreaks.player1.toString()}
            id={4}
          />
          <Stat
            title={`${fighter_data[1].fighter_name} Streak`}
            value={CurrentStreaks.player2.toString()}
            id={5}
          />
        </>
      ) : (
        <Stat title="Streak" value={CurrentStreaks.toString()} id={4} />
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
    <div className="w-fit h-fit xl:max-w-[150px] flex flex-row items-center gap-2 min-w-0 max-w-full justify-start">
      <p className="text-[#FCAB3A] text-2xl font-bold">{id}.</p>
      <div className="w-full h-fit flex flex-col items-start justify-center ">
        <p className="text-[#FCAB3A] text-2xl font-bold truncate w-full">
          {title}
        </p>
        <p className="text-white text-2xl font-bold -mt-2 truncate w-full ">
          {value}
        </p>
      </div>
    </div>
  );
}
