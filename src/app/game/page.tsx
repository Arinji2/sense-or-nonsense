import Image from "next/image";
import { redirect } from "next/navigation";
import { ConnectPBAdmin } from "../../../utils/connectPB";

import { ValidateGameIDCookie } from "../../../utils/game-data";
import { BackdropsList } from "../backdrop/backdrops";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

import Controls from "./controls.client";
import Menu from "./menu.client";
import { MusicProvider } from "./music-context";
import PlayerView from "./player-view";
import Settings from "./settings";
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
    redirect(`/dashboard/games/${gameData.id}`);
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
    <MusicProvider>
      <div className="flex h-fit min-h-[100svh] w-full flex-col items-center justify-center gap-10 overflow-x-hidden py-10 pb-20 xl:h-[100svh] xl:gap-0 xl:py-0 xl:pb-0">
        <div className="fixed left-0 top-0 h-[100svh] w-full">
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
        <PlayerView
          playerData={playerData}
          CurrentStreaks={CurrentStreaks}
          currentPlayer={currentPlayer}
          className="hidden xl:flex"
        />
        <div className="top-5 z-30 flex flex-row items-center justify-center gap-2 rounded-md bg-black px-3 py-2 xl:fixed xl:right-5">
          <span className="text-sm font-medium text-green-500">SENSE</span>
          <span className="text-sm font-medium text-white">OR</span>
          <span className="text-sm font-medium text-red-500">NONSENSE</span>
        </div>
        <Settings />

        <div className="relative z-20 flex h-full w-full flex-col justify-end">
          <div className="flex h-[80%] w-full flex-col items-center justify-start gap-5 overflow-hidden pb-5 xl:h-[60%] xl:gap-10">
            <h1 className="line-clamp-2 w-full max-w-[800px] p-2 py-0 text-center text-sm font-bold tracking-title text-white md:text-lg xl:line-clamp-1 xl:text-3xl">
              {wordData.word.toUpperCase()}
            </h1>
            <div className="relative flex w-fit max-w-[80%] flex-col items-center justify-center rounded-md bg-[#FCAB3A]/90 p-3">
              <p className="tracking-text line-clamp-4 text-center text-xs text-black md:text-base xl:line-clamp-2 xl:text-sm">
                {wordData.definition}
              </p>
            </div>
            <Controls
              data={wordData}
              previousGames={rounds}
              level={SelectedDifficulty.level}
              streak={CurrentStreaks[currentPlayer]}
              playerName={SelectedPlayer.fighter_name!}
              fighters={playerData}
              maxRounds={SelectedDifficulty.rounds}
            />
            <div className="mt-auto hidden flex-row items-center justify-center gap-20 xl:flex">
              <RenderStats
                {...{
                  CurrentRound,
                  SelectedDifficulty,
                  SelectedGame,
                }}
              />
            </div>
            <PlayerView
              playerData={playerData}
              CurrentStreaks={CurrentStreaks}
              currentPlayer={currentPlayer}
              className="static flex xl:hidden"
            />
            <Menu>
              <div className="flex w-[80%] flex-col items-start justify-start gap-6">
                <RenderStats
                  {...{
                    CurrentRound,
                    SelectedDifficulty,
                    SelectedGame,
                  }}
                />
              </div>
            </Menu>
          </div>
        </div>
      </div>
    </MusicProvider>
  );
}
