"use client";

import {
  DeleteDefaultBackdropAction,
  DeleteDefaultFighterAction,
} from "@/actions/defaults";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function FighterReset() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        toast.promise(DeleteDefaultFighterAction(), {
          loading: "Resetting Default Fighter...",
          success: "Default Fighter Reset",
          error: "Failed to reset default fighter",
        });
        router.refresh();
      }}
      className="w-full bg-red-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit"
    >
      Reset Default
    </Button>
  );
}

export function BackdropReset() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        toast.promise(DeleteDefaultBackdropAction(), {
          loading: "Resetting Default Backdrop...",
          success: "Default Backdrop Reset",
          error: "Failed to reset default backdrop",
        });
        router.refresh();
      }}
      className="w-full bg-red-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit"
    >
      Reset Default
    </Button>
  );
}
