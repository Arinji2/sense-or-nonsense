import { unstable_cache } from "next/cache";
import Client from "pocketbase";
import {
  RoundsSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { CurrentGameStreaks } from "../../../validations/generic/types";
import { GamesList } from "../games";
//SelectedGame: typeof GamesList[0]

export function GetCurrentStreaks({
  SelectedGame,
  games,
  currentPlayer,
}: {
  SelectedGame: (typeof GamesList)[0];
  games: RoundsSchemaType[];
  currentPlayer: "0" | "1";
}): CurrentGameStreaks {
  if (SelectedGame.isMultiplayer) {
    const streaks = { player1: 0, player2: 0 };

    const player1Rounds = games.filter((game) => game.playerIndex === 0);
    for (let i = player1Rounds.length - 1; i >= 0; i--) {
      const game = player1Rounds[i];
      if (!game.isCorrect && i === player1Rounds.length - 1) {
        streaks.player1 = 0;
        break;
      } else if (game.isCorrect) {
        streaks.player1++;
      } else if (!game.isCorrect) {
        break;
      }
    }

    const player2Rounds = games.filter((game) => game.playerIndex === 1);
    for (let i = player2Rounds.length - 1; i >= 0; i--) {
      const game = player2Rounds[i];
      if (!game.isCorrect && i === player2Rounds.length - 1) {
        streaks.player2 = 0;
        break;
      } else if (game.isCorrect) {
        streaks.player2++;
      } else if (!game.isCorrect) {
        break;
      }
    }
    return {
      player1: streaks.player1,
      player2: streaks.player2,
      currentPlayer:
        streaks[
          `player${Number.parseInt(currentPlayer) + 1}` as "player1" | "player2"
        ],
    };
  } else {
    let streak = 0;
    for (let i = games.length - 1; i >= 0; i--) {
      if (games[i].isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
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
  currentPlayer: string;
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
    [currentPlayer, filteredIDs],
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
