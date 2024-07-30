"use server";

import { redirect } from "next/navigation";
import { ConnectPBAdmin } from "../../utils/connectPB";
import { DecryptGameDataAction } from "../../utils/game-data";
import { GetUserMode } from "../../utils/getMode";
import { RoundsSchemaType } from "../../validations/game-data/types";

export default async function PushNewGameAction({
  previousGames,
}: {
  previousGames: RoundsSchemaType[];
}) {
  const pb = await ConnectPBAdmin();
  const userData = await GetUserMode();
  const jwtData = await DecryptGameDataAction({});
  jwtData.game = await Promise.all(
    previousGames.map(async (data) => {
      const pbData = await pb
        .collection(data.isFake ? "fake_words" : "real_words")
        .getOne(data.recordID);

      return {
        ...data,
        word: pbData.word,
      };
    }),
  );
  if (!userData.userID) redirect("/");
  const gameData = await pb.collection("games").create({
    data: jwtData,
    user: userData.userID,
  });

  return gameData.id;
}
