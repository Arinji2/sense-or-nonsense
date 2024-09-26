"use server";

import { FightersList } from "@/app/fighters/fighters";
import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { GameSchema } from "../../../validations/pb/schema";
export async function AddFighterAction(fighterData: GameFighterSchemaType) {
  const { pb, userID, mode } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();

  const isValid = FightersList.find(
    (fighter) => fighter.id === fighterData.fighter_id,
  );
  if (!isValid) {
    throw new Error("Invalid difficulty level");
  }
  const game = await pb!.collection("games").update(gameData.id, {
    playerData: `${fighterData.fighter_id}:${fighterData.fighter_name}`,
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}

export async function RemoveFighterAction() {
  const gameData = await ValidateGameIDCookie();
  const { pb, userID, mode } = await GetUserMode();

  const game = await pb!.collection("games").update(gameData.id, {
    playerData: "",
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}

export async function UpdateFighterAction(fighterData: GameFighterSchemaType) {
  const { pb, userID, mode } = await GetUserMode();
  const gameData = await ValidateGameIDCookie();

  const isValid = FightersList.find(
    (fighter) => fighter.id === fighterData.fighter_id,
  );
  if (!isValid) {
    throw new Error("Invalid difficulty level");
  }
  if (typeof gameData.playerData === "boolean")
    throw new Error("Player data deformed");
  const updatedPlayerData = [
    ...gameData.playerData,
    {
      fighter_id: fighterData.fighter_id,
      fighter_name: fighterData.fighter_name,
    },
  ] as GameFighterSchemaType[];

  const formattedData = updatedPlayerData.map((player) => {
    return `${player.fighter_id}:${player.fighter_name}`;
  });
  const game = await pb!.collection("games").update(gameData.id, {
    playerData: formattedData.join(";"),
  });
  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}
