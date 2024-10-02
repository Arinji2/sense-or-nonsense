import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { DifficultyList } from "../difficulty/difficully";
import { GamesList } from "../games";

import { GameSchemaType } from "../../../validations/pb/types";
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
  let isSettingDefaults = false;
  let globalGameData: GameSchemaType = {} as GameSchemaType;

  if (searchParams.setDefaults === "true") isSettingDefaults = true;

  if (!isSettingDefaults) {
    const { gameData } = await ValidateGameIDCookie();
    globalGameData = gameData;
  }

  let isMultiplayer = false;

  if (!isSettingDefaults) {
    try {
      let selectedGame = GamesList.find(
        (game) => game.id === Number.parseInt(globalGameData.gameID),
      );
      if (selectedGame === undefined) {
        if (isSettingDefaults) {
          selectedGame = GamesList[0];
        }
        throw new Error();
      }

      if (selectedGame.isMultiplayer) isMultiplayer = true;
      if (
        DifficultyList.find(
          (difficulty) =>
            difficulty.level === Number.parseInt(globalGameData.difficulty),
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
  }
  if (typeof globalGameData.playerData === "boolean")
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
            fighterData: globalGameData.playerData,
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
