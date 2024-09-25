"use server";

import { DifficultyList } from "@/app/difficulty/difficully";
import { GetUserMode } from "../../../utils/getMode";
import { GameSchema } from "../../../validations/pb/schema";
export async function AddDifficultyAction(
  gameID: string,
  difficultyLevel: number,
) {
  const { pb, userID, mode } = await GetUserMode();
  if (mode === "guest") {
    try {
      const game = await pb!.collection("games").getOne(gameID);
      const parsedGame = GameSchema.parse(game);
      if (parsedGame.user !== userID) {
        throw new Error();
      }
    } catch (e) {
      throw new Error("You are not the owner of this game");
    }
  }

  const isValid = DifficultyList.find(
    (difficulty) => difficulty.level === difficultyLevel,
  );
  if (!isValid) {
    throw new Error("Invalid difficulty level");
  }
  const game = await pb!.collection("games").update(gameID, {
    difficulty: difficultyLevel.toString(),
  });

  const parsedGame = GameSchema.safeParse(game);
  if (!parsedGame.success) {
    throw new Error("Game not found");
  }
}
