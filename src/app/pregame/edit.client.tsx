"use client";

import { RemoveBackdropAction } from "@/actions/game/backdrop";
import { RemoveDifficultyAction } from "@/actions/game/difficulty";
import { RemoveFighterAction } from "@/actions/game/fighters";
import { RemoveGameAction } from "@/actions/game/setup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditButton({
  objKey,
}: {
  objKey: "game" | "difficulty" | "backdrop" | "playerData";
}) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (objKey === "game") {
          toast.promise(RemoveGameAction(), {
            loading: "Removing game...",
            success: "Game deleted",
            error: "Failed to remove game",
          });
          router.push("/single");
        } else if (objKey === "difficulty") {
          toast.promise(RemoveDifficultyAction(), {
            loading: "Removing difficulty...",
            success: "Difficulty removed",
            error: "Failed to remove difficulty",
          });
        } else if (objKey === "backdrop") {
          toast.promise(RemoveBackdropAction(), {
            loading: "Removing backdrop...",
            success: "Backdrop removed",
            error: "Failed to remove backdrop",
          });
        } else if (objKey === "playerData") {
          toast.promise(RemoveFighterAction(), {
            loading: "Removing fighter...",
            success: "Fighter removed",
            error: "Failed to remove fighter",
          });
        }

        router.refresh();
      }}
      className="inline rounded-sm bg-red-500 px-4 py-1 text-lg text-white"
    >
      EDIT
    </button>
  );
}
