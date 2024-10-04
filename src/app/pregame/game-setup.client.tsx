"use client";

import { useRouter } from "next/navigation";

import { CreateNewRound } from "@/actions/game/rounds";
import { Button } from "@/components/button";
import toast from "react-hot-toast";

export default function GameSetup() {
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
      className="w-full bg-green-500 text-white xl:w-fit"
    >
      START GAME{" "}
    </Button>
  );
}
