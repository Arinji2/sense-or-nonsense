"use client";
import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";

export default function Menu({
  streakStarted,
  children,
}: {
  streakStarted?: boolean;
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOpenMenus = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsActive(false);
      }
    });

    window.addEventListener("mousedown", closeOpenMenus);
    return () => {
      window.removeEventListener("mousedown", closeOpenMenus);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn({
        "w-full h-[60%] md:hidden flex py-4 translate-y-[calc(100%-70px)] gap-5 bg-black fixed bottom-0 left-0 z-50  flex-col items-center justify-start  transition-all ease-in-out duration-500":
          true,
        "translate-y-0": isActive,
      })}
    >
      <button
        onClick={() => {
          setIsActive((prev) => !prev);
        }}
        className="p-2 outline-none bg-[#FCAB3A] rounded-full w-fit h-auto aspect-square"
      >
        <ChevronUp
          size={26}
          strokeWidth={2}
          className={cn({
            "text-black transition-all ease-in-out duration-500 rotate-0": true,
            "rotate-180": isActive,
            "animate-bounce": streakStarted && !isActive,
          })}
        />
      </button>
      {children}
    </div>
  );
}
