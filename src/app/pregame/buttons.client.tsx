"use client";

import { CreateNewRound } from "@/actions/game/rounds";
import { RemoveGameAction } from "@/actions/game/setup";
import { Button } from "@/components/button";
import useLoading from "@/hooks/useLoading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function StartGameButton() {
  const router = useRouter();
  const { isGlobalLoading, startAsyncLoading, startLoading } = useLoading();
  return (
    <Button
      disabled={isGlobalLoading}
      onClick={async () => {
        await startAsyncLoading(async () => {
          await toast.promise(CreateNewRound(), {
            loading: "Setting up game...",
            success: "Game created successfully",
            error: "Failed to create game",
          });
        });

        startLoading(() => {
          router.push("/game");
        });
      }}
      className="w-full bg-green-500 text-xs text-white xl:w-fit xl:text-sm"
    >
      START GAME{" "}
    </Button>
  );
}

export function DeleteGameButton() {
  const router = useRouter();
  const { isGlobalLoading, startAsyncLoading, startLoading } = useLoading();
  return (
    <Button
      disabled={isGlobalLoading}
      onClick={async () => {
        await startAsyncLoading(async () => {
          await toast.promise(RemoveGameAction(), {
            loading: "Deleting game...",
            success: "Game deleted",
            error: "Failed to delete game",
          });
        });
        startLoading(() => {
          router.push("/");
        });
      }}
      className="w-full bg-red-500 text-xs text-white xl:w-fit xl:text-sm"
    >
      DELETE GAME
    </Button>
  );
}
