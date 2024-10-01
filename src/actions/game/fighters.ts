"use server";

import { FightersList } from "@/../constants/fighters";
import { revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GetUserMode } from "../../../utils/getMode";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { GameSchema } from "../../../validations/pb/schema";
export async function AddFighterAction(fighterData: GameFighterSchemaType) {
  const { pb, userID, mode } = await GetUserMode();
  const { gameData, rounds } = await ValidateGameIDCookie();

  const isValid = FightersList.find(
    (fighter) => fighter.id === fighterData.fighter_id,
  );
  if (!isValid) {
    throw new Error("Invalid difficulty level");
  }

  if (
    fighterData.fighter_name.toLowerCase().includes(":") ||
    fighterData.fighter_name.toLowerCase().includes(";") ||
    fighterData.fighter_name.toLowerCase().includes("CPU")
  ) {
    throw new Error("Name is invalid");
  }
  const uid = Math.floor(Math.random() * 100000);
  const game = await pb!.collection("games").update(gameData.id, {
    playerData: `${uid}:${fighterData.fighter_id}:${fighterData.fighter_name}`,
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }

  revalidateTag(`${CACHED_TAGS.game_data}-${userID}-${gameData.id}`);
}

export async function RemoveFighterAction() {
  const { gameData, rounds } = await ValidateGameIDCookie();
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
  const { gameData, rounds } = await ValidateGameIDCookie();

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
  const uid = Math.floor(Math.random() * 100000);
  const formattedData = updatedPlayerData.map((player) => {
    return `${uid}:${player.fighter_id}:${player.fighter_name}`;
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

export async function AddCPUAction() {
  const { pb, userID, mode } = await GetUserMode();
  const { gameData, rounds } = await ValidateGameIDCookie();
  if (gameData.gameID !== "1") throw new Error("Invalid game ID");
  const uid = Math.floor(Math.random() * 100000);

  const updatedPlayerData = [
    ...gameData.playerData,
    {
      fighter_uid: uid,
      fighter_id: 8,
      fighter_name: "CPU",
    },
  ] as GameFighterSchemaType[];
  const formattedData = updatedPlayerData.map((player) => {
    return `${Math.floor(Math.random() * 100000)}:${player.fighter_id}:${player.fighter_name}`;
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
