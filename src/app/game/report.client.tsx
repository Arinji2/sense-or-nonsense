"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "../../../utils/cn";

export default function Report({ isStatic }: { isStatic?: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTooltip(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <button
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      className={cn({
        "shadow-white/10 group shadow-xl  absolute md:flex hidden -right-24 flex-col items-center justify-center size-10 rounded-full bg-black":
          true,
        "static -right-auto md:hidden flex": isStatic,
      })}
    >
      <div
        className={cn({
          "w-fit h-fit p-2 bg-black  group- pointer-events-none absolute -top-[150%] left-0 rounded-sm opacity-0 transition-opacity ease-in-out duration-300":
            true,
          "opacity-100 ": showTooltip,
        })}
      >
        <p className="text-white text-xs tracking-text whitespace-nowrap text-left">
          See something broken? <br /> Report this word!
        </p>
      </div>
      <Image
        className=""
        src={"/game/report.png"}
        alt="Report"
        width={20}
        height={20}
      />
    </button>
  );
}
