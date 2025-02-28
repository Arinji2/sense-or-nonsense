"use client";

import { Button } from "@/components/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import LeaderboardImage from "../../public/leaderboard.png";
import useAnimate from "../../utils/useAnimate";

export default function LeaderboardModal({
  Animate,
}: {
  Animate: ReturnType<typeof useAnimate>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const closeOpenMenus = useCallback(
    async (e: any) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        localStorage.setItem("showLeaderboard", "true");
        Animate.setQueue(false);
      }
    },
    [Animate, containerRef],
  );
  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    function escHandler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeOpenMenus({});
      }
    }

    document.addEventListener("mousedown", (e) => {
      closeOpenMenus(e);
    });
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", (e) => {
        closeOpenMenus(e);
      });
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "unset";
    };
  }, [Animate.showComponent, closeOpenMenus]);

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100" : "opacity-0"
        } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
      >
        <div
          ref={containerRef}
          className="group flex h-[80%] w-[90%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-custom-black md:h-[80%] xl:h-[400px] xl:w-[80%] xl:flex-row"
        >
          <div className="relative h-[40%] w-full overflow-hidden xl:h-full xl:w-[30%]">
            <button
              aria-label="Close Modal"
              onClick={() => {
                closeOpenMenus({});
              }}
              className="absolute right-8 top-8 z-20 block rounded-sm bg-black/30 p-2 xl:hidden"
            >
              <X className="size-5 text-white" />
            </button>
            <Image
              fill
              src={LeaderboardImage}
              alt="Leaderboard"
              className="h-full w-full object-cover brightness-50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="relative flex h-fit w-full flex-col items-center justify-center gap-16 p-6 xl:h-full xl:w-[70%] xl:py-20">
            <button
              aria-label="Close Modal"
              onClick={() => {
                closeOpenMenus({});
              }}
              className="absolute right-8 top-8 hidden xl:block"
            >
              <X className="size-10 text-white" />
            </button>
            <div className="flex h-fit w-full flex-col items-center justify-center gap-9">
              <h4 className="tracking-subtitle text-center text-base font-bold text-green-500 md:text-lg xl:text-xl">
                {" "}
                YOU ARE ON THE LEADERBOARD!
              </h4>
              <p className="tracking-text text-center text-xs text-white/70 xl:text-base">
                Since you are playing as guest, your username is preselected.
                You can change it in the dashboard by converting to a user
                account.
              </p>
            </div>
            <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
              <Link href="/dashboard/account" className="h-fit w-full xl:w-fit">
                <Button className="w-full bg-green-500 text-xs text-white xl:w-fit xl:text-sm">
                  CONVERT ACCOUNT
                </Button>
              </Link>
              <Button
                onClick={() => {
                  closeOpenMenus({});
                }}
                className="w-full bg-red-500 text-xs text-white xl:w-fit xl:text-sm"
              >
                CLOSE MODAL
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
