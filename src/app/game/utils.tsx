import { unstable_cache } from "next/cache";
import Client from "pocketbase";
import {
  GameFighterSchemaType,
  WordSchemaType,
} from "../../../validations/game-data/types";
import { RoundSchemaType } from "../../../validations/pb/types";

export function GetCurrentStreaks({
  games,
  fighters,
}: {
  games: RoundSchemaType[];
  fighters: GameFighterSchemaType[];
}) {
  const streaks: { [key: number]: number | string } = {};

  for (let i = 0; i < fighters.length; i++) {
    streaks[fighters[i].fighter_uid] = 0;
  }

  const reversedGames = [...games].reverse();
  const filteredGames = reversedGames.filter((game) => game.id !== "");

  for (let i = 0; i < filteredGames.length; i++) {
    const game = filteredGames[i];
    const playerIndex = game.player_index;
    const playerData = fighters[playerIndex];

    const fighterUid = playerData.fighter_uid;

    if (typeof streaks[fighterUid] === "string") continue;

    if (game.correct) {
      streaks[fighterUid] = (streaks[fighterUid] as number) + 1;
    } else {
      streaks[fighterUid] = streaks[fighterUid].toString();
    }
  }

  for (let i = 0; i < fighters.length; i++) {
    const fighterUid = fighters[i].fighter_uid;
    if (typeof streaks[fighterUid] === "string") {
      const streak = streaks[fighterUid] as string;
      streaks[fighterUid] = Number.parseInt(streak);
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
