import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
import { GamesList } from "../games";
import Selector from "./selector.client";

export default async function Page({}) {
  const { pb, userID } = await GetUserMode();
  let isMultiplayer = false;
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

    const game = GamesList.find(
      (game) => game.id.toString() === parsedGame.gameID,
    );
    if (game === undefined) {
      throw new Error();
    }
    isMultiplayer = game.isMultiplayer;
  } catch (e) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-center gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-center text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
          SELECT A DIFFICULTY
        </h1>

        <div className="flex h-fit w-[95%] flex-row flex-wrap items-center justify-center gap-10 xl:w-full">
          <Selector gameID={gameID} isMultiplayer={isMultiplayer} />
        </div>
      </div>
    </div>
  );
}
