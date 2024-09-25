"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
export async function SetupGameAction(gameID: string) {
  const { pb, userID } = await GetUserMode();
  const game = await pb!.collection("games").create({
    user: userID,
    gameID: gameID,
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  cookies().set("game-id", parsedGame.data.id, {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: true,
    expires: new Date(new Date().getTime() + 604800000), // 7 days
    path: "/",
  });

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${parsedGame.data.id}`);
}

export async function RemoveGameAction() {
  const { pb, userID } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();
  await pb!.collection("games").delete(gameData.id);
  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
  cookies().delete("game-id");
}
