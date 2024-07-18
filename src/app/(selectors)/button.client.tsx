"use client";

import { GamesList } from "@/app/games";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { EncryptGameDataAction } from "../../../utils/game-data";

export default function PlayNowButton({
  gameData,
}: {
  gameData: (typeof GamesList)[0];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <button
      onClick={async () => {
        await EncryptGameDataAction({
          key: "game_id",
          value: gameData.id.toString(),
          reset: true,
        });
        toast.success("Game selected successfully!");
        const isRedirected = searchParams.get("redirected");
        if (isRedirected && isRedirected === "true") {
          router.replace("/pregame");
        } else router.push("/difficulty");
      }}
      className="text-white text-[15px] shrink-0 bg-green-500 p-2 px-4 rounded-sm"
    >
      PLAY NOW
    </button>
  );
}
