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
        "fixed bottom-0 left-0 z-50 flex h-[50%] w-full translate-y-[calc(100%-70px)] flex-col items-center justify-start gap-5 bg-black py-4 transition-all duration-500 ease-in-out xl:hidden":
          true,
        "translate-y-0": isActive,
      })}
    >
      <button
        onClick={() => {
          setIsActive((prev) => !prev);
        }}
        className="aspect-square h-auto w-fit rounded-full bg-[#FCAB3A] p-2 outline-none"
      >
        <ChevronUp
          size={26}
          strokeWidth={2}
          className={cn({
            "rotate-0 text-black transition-all duration-500 ease-in-out": true,
            "rotate-180": isActive,
            "animate-bounce": streakStarted && !isActive,
          })}
        />
      </button>
      {children}
    </div>
  );
}
