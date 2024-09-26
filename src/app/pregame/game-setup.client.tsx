"use client";

import { useRouter } from "next/navigation";

import { CreateNewRound } from "@/actions/game/rounds";
import toast from "react-hot-toast";

export default function GameSetup() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const resolve = toast.promise(CreateNewRound(), {
          loading: "Setting up game...",
          success: "Game created successfully",
          error: "Failed to create game",
        });
        await resolve;

        router.push("/game");
      }}
      className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-green-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
    >
      START GAME{" "}
    </button>
  );
}
