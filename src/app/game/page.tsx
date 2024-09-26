import Image from "next/image";
import { redirect } from "next/navigation";
import { ConnectPBAdmin } from "../../../utils/connectPB";

import { ValidateGameIDCookie } from "../../../utils/game-data";
import { BackdropsList } from "../backdrop/backdrops";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";
import Controls from "./controls.client";
import Menu from "./menu.client";
import Report from "./report.client";
import { RenderStats } from "./stats";
import { GetCurrentStreaks, GetIsFakeSelected, GetWordData } from "./utils";

export default async function Page() {
  const { gameData, rounds } = await ValidateGameIDCookie();

  if (!gameData.isValidated || typeof gameData.playerData === "boolean")
    throw new Error("Game not found");

  const { backdrop, difficulty, playerData, gameID } = gameData;

  const isFake = GetIsFakeSelected();

  const currentPlayer = rounds[rounds.length - 1].player_index;

  const pb = await ConnectPBAdmin();
  const SelectedGame = GamesList.find(
    (game) => game.id === Number.parseInt(gameID),
  )!;

  const filteredIDs = (() => {
    if (rounds.length === 0) return "";
    const ids = rounds.map((game) => `id!="${game.id}"`);
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
    (backdrops) => backdrops.id === Number.parseInt(backdrop),
  )!;
  const SelectedDifficulty = DifficultyList.find(
    (difficulties) => difficulties.level === Number.parseInt(difficulty),
  )!;
  const SelectedPlayer = playerData[currentPlayer];

  const CurrentRound = rounds[rounds.length - 1].round_number;

  if (CurrentRound > SelectedDifficulty.rounds) {
    redirect("/game/summary");
  }
  const CurrentStreaks = GetCurrentStreaks({
    games: rounds.slice(0, rounds.length - 1),
    fighters: playerData,
  });

  wordData.definition =
    wordData.definition.slice(0, 1).toUpperCase() +
    wordData.definition.slice(1);
  wordData.word =
    wordData.word.slice(0, 1).toUpperCase() + wordData.word.slice(1);

  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0 h-full w-full">
        <Image
          src={SelectedBackdrop.image}
          alt={SelectedBackdrop.name}
          fill
          className="object-cover brightness-[.3]"
          quality={50}
          priority
        />
        <div className="relative z-20 h-full w-full bg-gradient-to-b from-[#2C282830] from-0% to-[#2c282890] to-60% backdrop-blur-[2px]"></div>
      </div>
      <div className="fixed top-5 z-20 flex flex-row items-center justify-center gap-2 rounded-md bg-black px-3 py-2 xl:right-5">
        <span className="text-lg font-medium text-green-500">SENSE</span>
        <span className="text-lg font-medium text-white">OR</span>
        <span className="text-lg font-medium text-red-500">NONSENSE</span>
      </div>

      <div className="relative z-20 flex h-full w-full flex-col justify-end">
        <div className="flex h-[80%] w-full flex-col items-center justify-start gap-10 pb-5 md:h-[60%]">
          <h1 className="line-clamp-2 max-w-[800px] p-2 text-center text-[25px] font-medium tracking-subtitle text-white md:truncate md:text-[40px]">
            {wordData.word.toUpperCase()}
          </h1>
          <div className="relative flex w-fit max-w-[80%] flex-col items-center justify-center rounded-md bg-[#FCAB3A] p-3">
            <p className="line-clamp-4 text-center text-[15px] tracking-text text-black md:line-clamp-2 md:text-[20px]">
              {wordData.definition}
            </p>
            <Report />
          </div>
          <Controls
            data={wordData}
            previousGames={rounds}
            gameData={SelectedGame}
            streak={CurrentStreaks[currentPlayer]}
            playerName={SelectedPlayer.fighter_name!}
            fighters={playerData}
            maxRounds={SelectedDifficulty.rounds}
          />
          <div className="mt-auto hidden flex-row items-center justify-center gap-20 md:flex">
            <RenderStats
              {...{
                CurrentRound,
                SelectedDifficulty,
                SelectedPlayer,
                fighter_data: playerData,
                SelectedGame,
                CurrentStreaks,
              }}
            />
          </div>
          <Report isStatic />
          <Menu>
            <div className="flex w-[80%] flex-col items-start justify-start gap-6">
              <RenderStats
                {...{
                  CurrentRound,
                  SelectedDifficulty,
                  SelectedPlayer,
                  fighter_data: playerData,
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
