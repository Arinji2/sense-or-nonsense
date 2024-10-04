"use client";

import {
  CheckDefaultBackdropAction,
  CheckDefaultFighterAction,
} from "@/actions/defaults";
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
        await toast.promise(SetupGameAction(gameData.id.toString()), {
          loading: "Setting up game...",
          success: "Game selected successfully!",
          error: "Failed to select game",
        });

        const isRedirected = searchParams.get("redirected");
        if (isRedirected && isRedirected === "true") {
          router.replace("/pregame");
        }

        if (gameData.isMultiplayer) {
          router.push("/pregame");
          return;
        }

        let hasSetFighter = false;
        let hasSetBackdrop = false;

        await toast.promise(
          new Promise(async (resolve) => {
            try {
              hasSetFighter = await CheckDefaultFighterAction();

              if (!hasSetFighter) {
                resolve({
                  success: false,
                  error: "Failed to set default backdrop",
                });
              } else {
                resolve({ success: true });
              }
            } catch (err: any) {
              resolve({ success: false, error: err.message });
            }
          }),
          {
            loading: "Checking default fighter...",
            success: (data: any) =>
              data.success
                ? "Default fighter set successfully!"
                : "Default fighter not found!",
            error: (data) => data.error || "An error occurred",
          },
        );

        await toast.promise(
          new Promise(async (resolve) => {
            try {
              hasSetBackdrop = await CheckDefaultBackdropAction();

              if (!hasSetBackdrop) {
                resolve({
                  success: false,
                  error: "Failed to set default backdrop",
                });
              } else {
                resolve({ success: true });
              }
            } catch (err: any) {
              resolve({ success: false, error: err.message });
            }
          }),
          {
            loading: "Checking default backdrop...",
            success: (data: any) =>
              data.success
                ? "Default backdrop set successfully!"
                : "Default backdrop not found!",
            error: (data) => data.error || "An error occurred",
          },
        );

        if (!hasSetFighter) {
          router.push("/fighters");
        } else if (!hasSetBackdrop) {
          router.push("/backdrop");
        } else router.push("/pregame");
      }}
      className="w-full shrink-0 rounded-sm bg-green-500 p-2 px-4 text-xss font-bold text-white transition-all duration-200 ease-in-out hover:bg-green-600 md:text-xs xl:w-fit xl:text-sm xl:font-normal"
    >
      PLAY NOW
    </button>
  );
}
