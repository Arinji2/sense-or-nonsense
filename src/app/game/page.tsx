import Image from "next/image";
import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { RoundSchemaType } from "../../../validations/pb/types";
import { BackdropsList } from "../backdrop/backdrops";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";
import { MusicProvider } from "./context/music-context";
import { TimerProvider } from "./context/timer-context";
import Controls from "./game-controls/controls";
import Menu from "./menu.client";
import PlayerView from "./player-view";
import Settings from "./settings.client";
import { RenderStats } from "./stats";
import {
  GetCurrentStreaks,
  GetIsFakeSelected,
  GetRoundChange,
  GetWordData,
} from "./utils";

export default async function Page() {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();
  if (!gameData.isValidated || typeof gameData.playerData === "boolean")
    throw new Error("Game not found");
  const { backdrop, difficulty, playerData, gameID } = gameData;

  const isFake = GetIsFakeSelected();

  const currentPlayer = rounds[rounds.length - 1];
  const currentPlayerData = playerData[currentPlayer.player_index];
  const selectedGame = GamesList.find(
    (game) => game.id === Number.parseInt(gameID),
  )!;

  const filteredIDs = (() => {
    if (rounds.length === 0) return "";
    const ids = rounds
      .map((game) => {
        if (isFake && game.is_fake) {
          return `id!="${game.id}"`;
        } else if (!isFake && !game.is_fake) {
          return `id!="${game.id}"`;
        }
      })
      .filter((id) => id !== undefined);
    return "&&".concat(ids.join("&&"));
  })();

  const wordData = await GetWordData({
    isFake,
    difficulty,
    filteredIDs,
    pb,
  });

  const selectedBackdrop = BackdropsList.find(
    (backdrops) => backdrops.id === Number.parseInt(backdrop),
  )!;
  const selectedDifficulty = DifficultyList.find(
    (difficulties) => difficulties.level === Number.parseInt(difficulty),
  )!;

  const currentRound = rounds[rounds.length - 1].round_number;
  const reveredRounds = rounds.toReversed();

  const currentStreaks = GetCurrentStreaks({
    games: rounds.slice(0, rounds.length - 1),
    fighters: playerData,
  });

  if (currentRound > selectedDifficulty.rounds) {
    redirect(`/dashboard/games/${gameData.id}`);
  }

  const previousRound = rounds[rounds.length - 1];
  const goToNextRound = GetRoundChange({
    previousGames: rounds,
    fighters: playerData,
  });
  const currentRoundData = {
    round_number: previousRound.round_number,
    player_index: previousRound.player_index,
    is_correct: false,
    is_fake: wordData.isFake,
    time_elapsed: 10,
    fake_word: wordData.isFake ? wordData.id : "",
    real_word: wordData.isFake ? "" : wordData.id,
    correct: false,
    id: previousRound.id,
    created: new Date(),
    updated: new Date(),
    game: gameData.id,
  } as RoundSchemaType;

  const newPlayerIndex = goToNextRound ? 0 : currentRoundData.player_index + 1;

  const nextRoundData = {
    round_number: goToNextRound
      ? currentRoundData.round_number + 1
      : currentRoundData.round_number,
    player_index: newPlayerIndex,
    correct: false,
    id: "",
    time_elapsed: 10,
    is_fake: false,
    fake_word: "",
    real_word: "",
  } as RoundSchemaType;

  return (
    <TimerProvider defaultTimer={10} uniqueIdentifier={gameData.id}>
      <MusicProvider allowedPaths={["/game"]}>
        <div className="flex h-fit min-h-[100svh] w-full flex-col items-center justify-center gap-10 overflow-x-hidden py-10 pb-20 xl:h-[100svh] xl:gap-0 xl:py-0 xl:pb-0">
          <div className="fixed left-0 top-0 h-[100svh] w-full">
            <Image
              src={selectedBackdrop.image}
              alt={selectedBackdrop.name}
              fill
              className="object-cover brightness-[.3]"
              quality={50}
              priority
            />
            <div className="relative z-20 h-full w-full bg-gradient-to-b from-[#2C282830] from-0% to-[#2c282890] to-60% backdrop-blur-[2px]"></div>
          </div>
          <PlayerView
            playerData={playerData}
            CurrentStreaks={currentStreaks}
            currentPlayer={currentPlayer.player_index}
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
                currentRoundData={currentRoundData}
                currentStreak={currentStreaks[currentPlayerData.fighter_uid]}
                nextRoundData={nextRoundData}
                maxRounds={selectedDifficulty.rounds}
                difficultyLevel={selectedDifficulty.level}
                wordData={wordData}
                currentPlayer={currentPlayerData}
                isMultiPlayer={playerData.length > 1}
                userID={userID!}
              />
              <div className="mt-auto hidden flex-row items-center justify-center gap-20 xl:flex">
                <RenderStats
                  {...{
                    currentRound,
                    selectedDifficulty,
                    selectedGame,
                  }}
                />
              </div>
              <PlayerView
                playerData={playerData}
                CurrentStreaks={currentStreaks}
                currentPlayer={currentPlayer.player_index}
                className="static flex xl:hidden"
              />
              <Menu>
                <div className="flex w-[80%] flex-col items-start justify-start gap-6">
                  <RenderStats
                    {...{
                      currentRound,
                      selectedDifficulty,
                      selectedGame,
                    }}
                  />
                </div>
              </Menu>
            </div>
          </div>
        </div>
      </MusicProvider>
    </TimerProvider>
  );
}
