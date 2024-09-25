import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
import { GamesList } from "../games";
import Selector from "./selector.client";

export default async function Page({}) {
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
    if (
      GamesList.find(
        (game) => game.id === Number.parseInt(parsedGame.gameID),
      ) === undefined
    ) {
      throw new Error();
    }
  } catch (e) {
    redirect("/unauthorized");
  }

  return (
    <WidthWrapper>
      <div className="relative flex h-fit min-h-[100svh] w-full flex-col items-center justify-start gap-10 py-10">
        <h1 className="z-20 w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
          SELECT A DIFFICULTY
        </h1>
        <div className="flex h-fit w-[95%] flex-row flex-wrap items-center justify-center gap-10 xl:w-full">
          <Selector gameID={gameID} />
        </div>
      </div>
    </WidthWrapper>
  );
}
