import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { BackdropsList } from "../backdrop/backdrops";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";
import { MusicProvider } from "../old-game/music-context";
import { TimerProvider } from "./context/timer-context";
import { GetCurrentStreaks, GetIsFakeSelected, GetWordData } from "./utils";

export default async function Page() {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb } = await GetUserMode();
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
    const ids = rounds.map((game) => {
      if (isFake && game.is_fake) {
        return `id!="${game.id}"`;
      } else if (!isFake && !game.is_fake) {
        return `id!="${game.id}"`;
      }
    });
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

  const currentStreaks = GetCurrentStreaks({
    games: rounds.slice(0, rounds.length - 1),
    fighters: playerData,
  });

  if (currentRound > selectedDifficulty.rounds) {
    redirect(`/dashboard/games/${gameData.id}`);
  }

  return (
    <TimerProvider defaultTimer={10} uniqueIdentifier={gameData.id}>
      <MusicProvider allowedPaths={["/game"]}>
        <div className="flex h-fit min-h-[100svh] w-full flex-col items-center justify-center gap-10 overflow-x-hidden py-10 pb-20 xl:h-[100svh] xl:gap-0 xl:py-0 xl:pb-0">
          <div className="fixed left-0 top-0 h-[100svh] w-full"></div>
        </div>
      </MusicProvider>
    </TimerProvider>
  );
}
