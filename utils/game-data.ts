"use server";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CACHED_TAGS } from "../constants/tags";
import { GameSchema } from "../validations/pb/schema";
import { GameSchemaType } from "../validations/pb/types";
import { GetUserMode } from "./getMode";

export async function ValidateGameIDCookie(): Promise<GameSchemaType> {
  const { pb, userID } = await GetUserMode();
  const gameID = cookies().get("game-id")?.value;
  if (!gameID) {
    redirect("/single");
  }
  return await unstable_cache(
    async (id: string, user: string) => {
      try {
        const gameRecord = await pb?.collection("games").getOne(id);
        const parsedGame = GameSchema.parse(gameRecord);
        if (parsedGame.user !== user) {
          throw new Error();
        }

        return parsedGame;
      } catch (e: any) {
        redirect("/unauthorized");
      }
    },
    [],
    {
      tags: [`${CACHED_TAGS.game_data}-${userID}-${gameID}`],
    },
  )(gameID, userID!);
}
