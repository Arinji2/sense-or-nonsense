"use client";

import GAMEDATA from "@/app/games";
import { useRouter } from "next/navigation";
import { EncryptGameDataAction } from "../../../utils/game-data";

export default function PlayNowButton({
  gameData,
}: {
  gameData: (typeof GAMEDATA)[0];
}) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await EncryptGameDataAction({
          key: "game_id",
          value: gameData.id.toString(),
          reset: true,
        });

        router.push("/fighters");
      }}
      className="text-white text-[15px] shrink-0 bg-green-500 p-2 px-4 rounded-sm"
    >
      PLAY NOW
    </button>
  );
}
