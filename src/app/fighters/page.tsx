import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

import { FighterProvider } from "./context";
import Selector from "./selector.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    setDefaults: string | string[] | undefined;
  };
}) {
  const { pb, userID, mode } = await GetUserMode();
  const { gameData, rounds } = await ValidateGameIDCookie();
  let isSettingDefaults = false;

  if (searchParams.setDefaults && !Array.isArray(searchParams.setDefaults)) {
    if (mode !== "user") {
      redirect("/");
    }
    if (searchParams.setDefaults === "true") isSettingDefaults = true;
  }
  let isMultiplayer = false;

  try {
    let selectedGame = GamesList.find(
      (game) => game.id === Number.parseInt(gameData.gameID),
    );
    if (selectedGame === undefined) {
      if (isSettingDefaults) {
        selectedGame = GamesList[0];
      }
      throw new Error();
    }

    if (selectedGame.isMultiplayer) isMultiplayer = true;
    if (!isSettingDefaults) {
      if (
        DifficultyList.find(
          (difficulty) =>
            difficulty.level === Number.parseInt(gameData.difficulty),
        ) === undefined
      ) {
        throw new Error("difficulty");
      }
    }
  } catch (e: any) {
    if (e.message === "difficulty") {
      redirect("/difficulty");
    }
    redirect("/unauthorized");
  }

  if (typeof gameData.playerData === "boolean")
    throw new Error("Player data deformed");

  return (
    <WidthWrapper>
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-start gap-10 xl:flex-row xl:justify-between">
        <h1 className="tracking-subtitle w-full px-2 text-center text-[35px] font-bold text-red-500 md:text-[40px] xl:text-[60px] xl:leading-[100px]">
          SELECT <span className="inline xl:block">YOUR</span>{" "}
          <span className="inline xl:block">FIGHTER</span>
        </h1>
        <FighterProvider
          value={{
            fighterData: gameData.playerData,
            isMultiplayer: isMultiplayer,
            isSettingDefaults: isSettingDefaults,
          }}
        >
          <Selector />
        </FighterProvider>
      </div>
    </WidthWrapper>
  );
}
