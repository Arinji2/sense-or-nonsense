"use client";

import { SetupGameAction } from "@/actions/game/setup";
import { GamesList } from "@/app/games";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

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
        toast.promise(SetupGameAction(gameData.id.toString()), {
          loading: "Setting up game...",
          success: "Game selected successfully!",
          error: "Failed to select game",
        });
        const isRedirected = searchParams.get("redirected");
        if (isRedirected && isRedirected === "true") {
          router.replace("/pregame");
        } else router.push("/difficulty");
      }}
      className="shrink-0 rounded-sm bg-green-500 p-2 px-4 text-[15px] text-white"
    >
      PLAY NOW
    </button>
  );
}
