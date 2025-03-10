import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { memoize } from "nextjs-better-unstable-cache";
import Client from "pocketbase";
import { CACHED_TAGS } from "../constants/tags";
import { GameSchema, RoundsSchema } from "../validations/pb/schema";
import { GameSchemaType, RoundSchemaType } from "../validations/pb/types";
import { GetUserMode } from "./getMode";

type ValidateGameIDCookieType = {
  gameData: GameSchemaType;
  rounds: RoundSchemaType[];
};

export async function ValidateGameIDCookie(
  {
    disableRedirect,
  }: {
    disableRedirect?: boolean;
  } = {
    disableRedirect: false,
  },
): Promise<ValidateGameIDCookieType> {
  "use server";
  const { pb, userID } = await GetUserMode();
  const gameID = cookies().get("game-id")?.value;
  if (!gameID && !disableRedirect) {
    redirect("/single");
  } else if (!gameID && disableRedirect) {
    throw new Error("Exiting for error");
  } else if (disableRedirect) {
    throw new Error("Exiting before redirect");
  }

  return await GetGameData(pb, gameID!, userID!);
}

export async function GetGameData(pb: Client, gameID: string, userID: string) {
  try {
    const memoizedFetch = memoize(
      async (id: string, user: string) => {
        const gameRecord = await pb?.collection("games").getOne(id);
        const roundRecords = await pb?.collection("rounds").getFullList({
          filter: `game="${id}"`,
          sort: "created",
          expand: "game,fake_word,real_word",
        });

        return { gameRecord, roundRecords };
      },
      {
        log: ["datacache", "verbose"],
        revalidateTags: [`${CACHED_TAGS.game_data}-${userID}-${gameID}`],
      },
    );

    const { gameRecord, roundRecords } = await memoizedFetch(gameID!, userID!);

    const parsedGame = GameSchema.parse(gameRecord);
    if (parsedGame.user !== userID) {
      throw new Error();
    }

    const parsedRoundData = RoundsSchema.safeParse(roundRecords);
    if (!parsedRoundData.success) {
      throw new Error("Game not found");
    }

    return {
      gameData: parsedGame,
      rounds: parsedRoundData.data,
    };
  } catch (e: any) {
    try {
      cookies().delete("game-id");
    } catch (e) {}
    redirect("/unauthorized");
  }
}
