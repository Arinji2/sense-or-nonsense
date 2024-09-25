"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GameSchema } from "../validations/pb/schema";
import { GameSchemaType } from "../validations/pb/types";
import { GetUserMode } from "./getMode";

export async function ValidateGameIDCookie(): Promise<GameSchemaType> {
  const { pb, userID } = await GetUserMode();
  const gameID = cookies().get("game-id")?.value;
  if (!gameID) {
    redirect("/single");
  }
  try {
    const gameRecord = await pb?.collection("games").getOne(gameID);
    const parsedGame = GameSchema.parse(gameRecord);
    if (parsedGame.user !== userID) {
      throw new Error();
    }

    return parsedGame;
  } catch (e: any) {
    redirect("/unauthorized");
  }
}
