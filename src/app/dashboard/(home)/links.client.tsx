"use client";

import { Button } from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "../../../../utils/cn";

export function SinglePlayerButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/single")}
      className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 xl:py-2"
    >
      <p className="text-xs font-bold text-white md:text-xs">SINGLE PLAYER</p>
    </Button>
  );
}

export function MultiPlayerButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/multi")}
      className="h-fit w-full rounded-sm bg-teal-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 xl:py-2"
    >
      <p className="text-xs font-bold text-white md:text-xs">MULTI PLAYER</p>
    </Button>
  );
}

export function DefaultsButton({ isGuest }: { isGuest: boolean }) {
  return (
    <Link
      href={isGuest ? "#" : "/dashboard/defaults"}
      onClick={() => {
        if (isGuest) {
          toast.error(
            "Guests can't edit defaults. Please convert your account to a user.",
          );
        }
      }}
      className={cn(
        "h-fit w-full rounded-sm bg-teal-500 bg-opacity-30 px-3 leading-tight shadow-md shadow-black transition-all duration-200 ease-in-out hover:bg-opacity-70 xl:w-fit xl:py-2",
        {
          "cursor-not-allowed opacity-20": isGuest,
        },
      )}
    >
      <p className="text-xss font-bold text-white">Edit Defaults</p>
    </Link>
  );
}
