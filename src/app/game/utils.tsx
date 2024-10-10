import { unstable_noStore } from "next/cache";
import Client from "pocketbase";
import {
  GameFighterSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { RoundSchemaType } from "../../../validations/pb/types";

export function GetIsFakeSelected() {
  const rounds = Array.from({ length: 5 }, () => Math.random() < 0.5);
  const isFake = rounds.reduce((acc, curr) => acc + Number(curr), 0) < 3;

  return isFake;
}

export async function GetWordData({
  isFake,
  difficulty,
  filteredIDs,
  pb,
}: {
  isFake: boolean;
  difficulty: string;
  filteredIDs: string;
  pb: Client;
}) {
  unstable_noStore();
  let wordData: WordSchemaType;
  if (filteredIDs === "&&") filteredIDs = "";

  const data = await pb
    .collection(isFake ? "fake_words" : "real_words")
    .getFirstListItem(`level="${difficulty}"${filteredIDs}`, {
      sort: "@random",
    });

  wordData = {
    word: data.word,
    definition: data.definition,
    id: data.id,
    difficulty: data.level,
    isFake: isFake,
  } as WordSchemaType;
  return wordData;
}
export function GetCurrentStreaks({
  games,
  fighters,
}: {
  games: RoundSchemaType[];
  fighters: GameFighterSchemaType[];
}): { [k: string]: number } {
  const streaks: { [k: string]: number } = {};
  fighters.forEach((fighter) => {
    streaks[fighter.fighter_uid.toString()] = 0;
  });
  const stopCounting: string[] = [];
  games.reverse();

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    if (game.id === "") continue;

    const uid = fighters[game.player_index].fighter_uid.toString();
    if (stopCounting.includes(uid)) continue;

    if (game.correct) {
      streaks[uid]++;
    } else {
      stopCounting.push(uid);
    }
  }

  return streaks;
}

export function GetRoundChange({
  previousGames,
  fighters,
}: {
  previousGames: RoundSchemaType[];
  fighters: GameFighterSchemaType[];
}) {
  const hasPlayed = new Set<number>();
  let goToNextRound = true;
  let previousRound = previousGames[previousGames.length - 1];

  if (previousGames.length < fighters.length) return false;

  for (let i = previousGames.length - 1; i >= 0; i--) {
    if (hasPlayed.size === fighters.length) break;
    const game = previousGames[i];

    const round = game;
    const player = game.player_index;

    if (hasPlayed.has(player)) continue;

    hasPlayed.add(player);

    if (round.round_number !== previousRound.round_number) {
      goToNextRound = false;

      break;
    }
    previousRound = round;
  }

  return goToNextRound;
}
