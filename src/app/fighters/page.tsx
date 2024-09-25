import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";
import Selector from "./selector.client";

export default async function Page() {
  const { pb, userID } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();
  try {
    if (
      GamesList.find((game) => game.id === Number.parseInt(gameData.gameID)) ===
      undefined
    ) {
      throw new Error();
    }

    if (
      DifficultyList.find(
        (difficulty) =>
          difficulty.level === Number.parseInt(gameData.difficulty),
      ) === undefined
    ) {
      throw new Error("difficulty");
    }
  } catch (e: any) {
    if (e.message === "difficulty") {
      redirect("/difficulty");
    }
    redirect("/unauthorized");
  }

  return (
    <WidthWrapper>
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-start gap-10 xl:flex-row xl:justify-between">
        <h1 className="w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-red-500 md:text-[40px] xl:text-[60px] xl:leading-[100px]">
          SELECT <span className="inline xl:block">YOUR</span>{" "}
          <span className="inline xl:block">FIGHTER</span>
        </h1>
        <Selector />
      </div>
    </WidthWrapper>
  );
}
