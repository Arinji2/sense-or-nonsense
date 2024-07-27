import { unstable_cache } from "next/cache";
import Client from "pocketbase";
import {
  GameFighterSchemaType,
  RoundsSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";

export function GetCurrentStreaks({
  games,
  fighters,
}: {
  games: RoundsSchemaType[];
  fighters: GameFighterSchemaType[];
}) {
  const streaks: { [key: number]: number | string } = {};

  for (let i = 0; i < fighters.length; i++) {
    streaks[i] = 0;
  }

  const reversedGames = [...games].reverse();
  const filteredGames = reversedGames.filter((game) => game.recordID !== "");

  for (let i = 0; i < filteredGames.length; i++) {
    const game = filteredGames[i];
    const playerIndex = game.playerIndex;

    if (typeof streaks[playerIndex] === "string") continue;

    if (game.isCorrect) {
      streaks[playerIndex] = streaks[playerIndex] + 1;
    } else {
      streaks[playerIndex] = streaks[playerIndex].toString();
    }
  }

  for (let i = 0; i < fighters.length; i++) {
    if (typeof streaks[i] === "string") {
      const streak = streaks[i] as string;
      streaks[i] = Number.parseInt(streak);
    }
  }

  return streaks as { [key: number]: number };
}

export async function GetWordData({
  isFake,
  difficulty,
  filteredIDs,
  currentPlayer,
  pb,
}: {
  isFake: boolean;
  difficulty: number;
  filteredIDs: string;
  currentPlayer: number;
  pb: Client;
}) {
  const wordData = await unstable_cache(
    async () => {
      let wordData = {} as WordSchemaType;
      if (isFake) {
        const data = await pb
          .collection("fake_words")
          .getFirstListItem(`level="${difficulty}"${filteredIDs}`, {
            sort: "@random",
          });
        wordData = {
          word: data.word,
          definition: data.definition,
          id: data.id,
          difficulty: data.level,
          isFake: true,
        } as WordSchemaType;
      } else {
        const data = await pb
          .collection("real_words")
          .getFirstListItem(`level="${difficulty}"${filteredIDs}`, {
            sort: "@random",
          });
        wordData = {
          word: data.word,
          definition: data.definition,
          id: data.id,
          difficulty: data.level,
          isFake: false,
        } as WordSchemaType;
      }
      return wordData;
    },
    [currentPlayer.toString(), filteredIDs],
    {
      revalidate: 5,
    },
  )();

  return wordData;
}

export function GetIsFakeSelected() {
  const rounds = Array.from({ length: 5 }, () => Math.random() < 0.5);
  const isFake = rounds.reduce((acc, curr) => acc + Number(curr), 0) < 3;

  return isFake;
}
