import Image from "next/image";
import { redirect } from "next/navigation";
import { ConnectPBAdmin } from "../../../utils/connectPB";
import { DecryptGameDataAction } from "../../../utils/game-data";
import { RoundsSchemaType } from "../../../validations/game-data/types";
import { BackdropsList } from "../backdrop/backdrops";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";
import Controls from "./controls.client";
import Menu from "./menu.client";
import Report from "./report.client";
import { RenderStats } from "./stats";
import { GetCurrentStreaks, GetIsFakeSelected, GetWordData } from "./utils";

export default async function Page() {
  const data = await DecryptGameDataAction();
  if (!data.game_id || !data.difficulty || !data.fighter_data || !data.backdrop)
    redirect("/pregame");

  const { backdrop, difficulty, fighter_data, game, game_id } = data;

  const isFake = GetIsFakeSelected();

  const games = [...(game ?? [])] as RoundsSchemaType[] | [];

  const pb = await ConnectPBAdmin();
  const SelectedGame = GamesList.find(
    (game) => game.id === Number.parseInt(game_id)
  )!;

  const currentPlayer = SelectedGame.isMultiplayer
    ? games.length === 0
      ? "0"
      : games[games.length - 1].playerIndex.toString() === "0"
      ? "1"
      : "0"
    : "0";

  const filteredIDs = (() => {
    if (games.length === 0) return "";
    const ids = games.map((game) => `id!="${game.recordID}"`);
    return "&&".concat(ids.join("&&"));
  })();

  const wordData = await GetWordData({
    isFake,
    difficulty: Number.parseInt(difficulty),
    filteredIDs,
    currentPlayer,
    pb,
  });

  const SelectedBackdrop = BackdropsList.find(
    (backdrops) => backdrops.id === Number.parseInt(backdrop)
  )!;
  const SelectedDifficulty = DifficultyList.find(
    (difficulties) => difficulties.level === Number.parseInt(difficulty)
  )!;
  const SelectedPlayer = fighter_data[Number.parseInt(currentPlayer)];

  const CurrentRound = games.slice(-1)[0]?.round ?? 1;

  if (CurrentRound > SelectedDifficulty.rounds) {
    redirect("/game/summary");
  }
  const CurrentStreaks = GetCurrentStreaks({
    SelectedGame,
    games,
    currentPlayer,
  });

  wordData.definition =
    wordData.definition.slice(0, 1).toUpperCase() +
    wordData.definition.slice(1);
  wordData.word =
    wordData.word.slice(0, 1).toUpperCase() + wordData.word.slice(1);

  return (
    <div className="w-full h-[100svh] flex flex-col items-center  justify-center">
      <div className="w-full h-full absolute left-0 top-0">
        <Image
          src={SelectedBackdrop.image}
          alt={SelectedBackdrop.name}
          fill
          className="object-cover brightness-[.3] "
          quality={50}
          priority
        />
        <div className="w-full h-full bg-gradient-to-b backdrop-blur-[2px]  from-[#2C282830] to-[#2c282890] from-0% to-60% relative z-20"></div>
      </div>
      <div className="fixed top-5 xl:right-5 z-20 bg-black px-3 py-2 flex flex-row items-center rounded-md justify-center gap-2">
        <span className="text-lg font-medium text-green-500">SENSE</span>
        <span className="text-lg font-medium text-white">OR</span>
        <span className="text-lg font-medium text-red-500">NONSENSE</span>
      </div>

      <div className="w-full h-full flex flex-col z-20  relative justify-end">
        <div className="w-full h-[80%] md:h-[60%] pb-5 flex flex-col items-center  justify-start gap-10 ">
          <h1 className=" font-medium text-[25px] md:text-[40px] text-white text-center line-clamp-2 md:truncate max-w-[800px] p-2 tracking-subtitle">
            {wordData.word.toUpperCase()}
          </h1>
          <div className="relative flex flex-col items-center  justify-center w-fit max-w-[80%] bg-[#FCAB3A] rounded-md p-3">
            <p className="tracking-text line-clamp-4 md:line-clamp-2  text-center text-[15px] md:text-[20px] text-black">
              {wordData.definition}
            </p>
            <Report />
          </div>
          <Controls
            data={wordData}
            previousGames={games}
            gameData={SelectedGame}
            streak={
              typeof CurrentStreaks === "number"
                ? CurrentStreaks
                : CurrentStreaks.currentPlayer
            }
            playerName={SelectedPlayer.fighter_name}
          />
          <div className="mt-auto md:flex hidden  flex-row items-center  justify-center gap-20">
            <RenderStats
              {...{
                CurrentRound,
                SelectedDifficulty,
                SelectedPlayer,
                fighter_data,
                SelectedGame,
                CurrentStreaks,
              }}
            />
          </div>
          <Report isStatic />
          <Menu>
            <div className="flex w-[80%] flex-col items-start gap-6  justify-start">
              <RenderStats
                {...{
                  CurrentRound,
                  SelectedDifficulty,
                  SelectedPlayer,
                  fighter_data,
                  SelectedGame,
                  CurrentStreaks,
                }}
              />
            </div>
          </Menu>
        </div>
      </div>
    </div>
  );
}
