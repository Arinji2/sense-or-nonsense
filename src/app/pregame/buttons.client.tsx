"use client";

import { CreateNewRound } from "@/actions/game/rounds";
import { RemoveGameAction } from "@/actions/game/setup";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function StartGameButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const resolve = toast.promise(CreateNewRound(), {
          loading: "Setting up game...",
          success: "Game created successfully",
          error: "Failed to create game",
        });
        await resolve;

        router.push("/game");
      }}
      className="w-full bg-green-500 text-xs text-white xl:w-fit xl:text-sm"
    >
      START GAME{" "}
    </Button>
  );
}

export function DeleteGameButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await toast.promise(RemoveGameAction(), {
          loading: "Deleting game...",
          success: "Game deleted",
          error: "Failed to delete game",
        });

        router.push("/");
      }}
      className="w-full bg-red-500 text-xs text-white xl:w-fit xl:text-sm"
    >
      DELETE GAME
    </Button>
  );
}
