"use server";

import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { RoundSchemaType } from "../../../validations/pb/types";

export async function CreateNewRound(nextRoundData?: RoundSchemaType) {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();

  const roundData = nextRoundData ?? {
    round_number: 1,
    player_index: 0,
    correct: false,
    is_fake: false,
    time_elapsed: 10,
    fake_word: "",
    real_word: "",
    game: gameData.id,
  };
  roundData.game = gameData.id;

  await pb.collection("rounds").create(roundData);
  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}

export async function UpdateRound(roundData: RoundSchemaType) {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();

  await pb.collection("rounds").update(roundData.id, {
    correct: roundData.correct,
    is_fake: roundData.is_fake,
    fake_word: roundData.fake_word,
    real_word: roundData.real_word,
    time_elapsed: roundData.time_elapsed,
    player_index: roundData.player_index,
    game: gameData.id,
  });

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}
