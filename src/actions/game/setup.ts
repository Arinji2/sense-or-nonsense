"use server";

import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
export async function SetupGameAction(gameID: string) {
  const { pb, userID } = await GetUserMode();
  try {
    const game = await pb
      .collection("games")
      .getFirstListItem(`user="${userID}" && completed=false`);
    const parsedGame = GameSchema.safeParse(game);
    if (!parsedGame.success) {
      throw new Error("Game not found");
    }

    cookies().set("game-id", parsedGame.data.id, {
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      expires: new Date(new Date().getTime() + 604800000), // 7 days
      path: "/",
    });
    revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${parsedGame.data.id}`);
    redirect("/pregame");
  } catch (e: any) {
    if (isRedirectError(e)) {
      throw e;
    }
    const game = await pb!.collection("games").create({
      user: userID,
      gameID: gameID,
    });

    const parsedGame = GameSchema.safeParse(game);
    if (!parsedGame.success) {
      throw new Error("Game not found");
    }

    cookies().set("game-id", parsedGame.data.id, {
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      expires: new Date(new Date().getTime() + 604800000), // 7 days
      path: "/",
    });

    revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${parsedGame.data.id}`);
  }
}

export async function RemoveGameAction() {
  const { pb, userID } = await GetUserMode();
  const { gameData } = await ValidateGameIDCookie();
  await pb!.collection("games").delete(gameData.id);
  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
  cookies().delete("game-id");
}

export async function FinishGameAction() {
  const { gameData, rounds } = await ValidateGameIDCookie();
  const { pb, userID } = await GetUserMode();

  await pb.collection("games").update(gameData.id, {
    completed: true,
  });

  cookies().delete("game-id");
  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
  revalidateTag(`${CACHED_TAGS.mode_select}-${userID}-${gameData.gameID}`);
  revalidateTag(`${CACHED_TAGS.user_games}-${userID}`);
  return gameData.id;
}
