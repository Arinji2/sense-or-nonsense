"use server";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CACHED_TAGS } from "../constants/tags";
import { GameSchema } from "../validations/pb/schema";
import { GameSchemaType } from "../validations/pb/types";
import { GetUserMode } from "./getMode";

export async function ValidateGameIDCookie(
  {
    expandFields,
    disableRedirect,
  }: {
    expandFields?: boolean;
    disableRedirect?: boolean;
  } = {
    expandFields: false,
    disableRedirect: false,
  },
): Promise<GameSchemaType> {
  const { pb, userID } = await GetUserMode();
  const gameID = cookies().get("game-id")?.value;
  if (!gameID && !disableRedirect) {
    redirect("/uuu");
  } else if (disableRedirect) {
    throw new Error("Exiting before redirect");
  }
  if (!expandFields) {
    expandFields = false;
  }
  return await unstable_cache(
    async (id: string, user: string, expandFields: boolean) => {
      try {
        const gameRecord = await pb?.collection("games").getOne(id, {
          expand: expandFields ? "rounds" : undefined,
        });
        if (expandFields) const parsedGame = GameSchema.parse(gameRecord);
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
  )(gameID!, userID!, expandFields);
}
