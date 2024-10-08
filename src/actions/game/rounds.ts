"use server";

import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { RoundSchemaType } from "../../../validations/pb/types";
import { AddCPUAction } from "./fighters";

export async function CreateNewRound(
  nextRoundData?: RoundSchemaType,
  disableRevalidate?: boolean,
) {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();

  if (
    !nextRoundData &&
    gameData.gameID === "1" &&
    gameData.playerData.find((player) => player.fighter_name === "CPU") ===
      undefined
  ) {
    await AddCPUAction();
  }

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
  if (!disableRevalidate) {
    revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
  }
}

export async function UpdateRound(
  roundData: RoundSchemaType,
  disableRevalidate?: boolean,
) {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();
  try {
    await pb.collection("rounds").update(roundData.id, {
      correct: roundData.correct,
      is_fake: roundData.is_fake,
      fake_word: roundData.fake_word,
      real_word: roundData.real_word,
      time_elapsed: roundData.time_elapsed,
      player_index: roundData.player_index,
      game: gameData.id,
    });
  } catch (e) {
    throw new Error("Failed to update round");
  }
  if (!disableRevalidate) {
    revalidateTag(`${CACHED_TAGS.user_games}-${userID}`);
    revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
  }
}
