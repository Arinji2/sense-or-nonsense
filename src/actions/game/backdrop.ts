"use server";

import { BackdropsList } from "@/app/backdrop/backdrops";
import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
export async function AddBackdropAction(backdropID: number) {
  const { pb, userID, mode } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();

  const isValid = BackdropsList.find((backdrop) => backdrop.id === backdropID);
  if (!isValid) {
    throw new Error("Invalid backdrop id");
  }
  const game = await pb!.collection("games").update(gameData.id, {
    backdrop: backdropID.toString(),
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}
