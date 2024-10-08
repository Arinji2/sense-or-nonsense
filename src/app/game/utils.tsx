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
}) {
  const streaks: Record<number, number> = Object.fromEntries(
    fighters.map((fighter) => [fighter.fighter_uid, 0]),
  );

  for (let i = games.length - 1; i >= 0; i--) {
    const game = games[i];
    if (game.id === "") continue;

    const fighterUid = fighters[game.player_index].fighter_uid;

    if (streaks[fighterUid] === -1) continue;

    if (game.correct) {
      streaks[fighterUid]++;
    } else {
      streaks[fighterUid] = -1;
    }
  }

  return Object.fromEntries(
    Object.entries(streaks).map(([key, value]) => [key, Math.max(value, 0)]),
  );
}
