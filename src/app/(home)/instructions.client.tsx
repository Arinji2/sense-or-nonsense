"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../utils/cn";

export function InstructionButton({ isFake }: { isFake: boolean }) {
  const [hasClicked, setHasClicked] = useState(false);
  return (
    <button
      onClick={() => {
        toast.success(
          `You clicked on the ${isFake ? "fake" : "real"} button. This means your decision was that the word is ${isFake ? "fake" : "real"}`,
          {
            duration: 10000,
          },
        );
        setHasClicked(true);
      }}
      className="relative flex size-[60px] flex-col items-center justify-center rounded-full bg-black"
    >
      <Image
        src={isFake ? "/game/fake.png" : "/game/real.png"}
        alt="Real"
        width={30}
        height={30}
      />

      <div
        className={cn(
          "absolute bottom-0 right-0 size-4 rounded-full bg-purple-500 transition-all duration-200 ease-in-out",
          {
            "opacity-0": hasClicked,
          },
          {
            "animate-pulse": !hasClicked,
          },
        )}
      ></div>
    </button>
  );
}
