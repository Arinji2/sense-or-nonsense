"use client";

import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

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
