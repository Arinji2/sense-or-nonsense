"use server";

import { DifficultyList } from "@/app/difficulty/difficully";
import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
export async function AddDifficultyAction(
  gameID: string,
  difficultyLevel: number,
) {
  const { pb, userID, mode } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();

  const isValid = DifficultyList.find(
    (difficulty) => difficulty.level === difficultyLevel,
  );
  if (!isValid) {
    throw new Error("Invalid difficulty level");
  }
  const game = await pb!.collection("games").update(gameID, {
    difficulty: difficultyLevel.toString(),
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}

export async function RemoveDifficultyAction() {
  const gameData = await ValidateGameIDCookie();
  const { pb, userID, mode } = await GetUserMode();

  const game = await pb!.collection("games").update(gameData.id, {
    difficulty: "",
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}
