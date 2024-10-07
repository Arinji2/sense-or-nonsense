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
        "group absolute -right-24 hidden size-10 flex-col items-center justify-center rounded-full bg-black shadow-xl shadow-white/10 md:flex":
          true,
        "-right-auto static flex md:hidden": isStatic,
      })}
    >
      <div
        className={cn({
          "group- pointer-events-none absolute -top-[150%] left-0 h-fit w-fit rounded-sm bg-black p-2 opacity-0 transition-opacity duration-300 ease-in-out":
            true,
          "opacity-100": showTooltip,
        })}
      >
        <p className="whitespace-nowrap text-left text-xs tracking-text text-white">
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
