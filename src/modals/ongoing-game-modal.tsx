"use client";

import { RemoveGameAction } from "@/actions/game/setup";
import { Button } from "@/components/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import InProgressGif from "../../public/in-progress.gif";
import useAnimate from "../../utils/useAnimate";

export default function OngoingGame({
  Animate,
  isDeleting,
  resetTimer,
}: {
  Animate: ReturnType<typeof useAnimate>;
  isDeleting?: boolean;
  resetTimer?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const closeOpenMenus = useCallback(
    async (e: any, isEventlistener?: boolean, override?: boolean) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        if (isDeleting && isEventlistener) {
          Animate.setQueue(false);
          router.refresh();
          if (resetTimer) resetTimer();
          return;
        }
        let confirmation = override ?? false;
        if (!isDeleting) {
          confirmation = window.confirm(
            "Are you sure you want to cancel? The game in progress will be deleted",
          );
        }

        confirmation = isDeleting ? true : confirmation;

        if (confirmation) {
          toast.promise(RemoveGameAction(), {
            loading: "Deleting game...",
            success: "Game deleted",
            error: "Failed to delete game",
          });
          if (isDeleting) {
            router.push("/");
          }
          router.refresh();
          Animate.setQueue(false);
        } else {
          return;
        }
      }
    },
    [Animate, containerRef, router, isDeleting, resetTimer],
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
      closeOpenMenus(e, true);
    });
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", (e) => {
        closeOpenMenus(e, true);
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
                if (isDeleting && resetTimer) {
                  Animate.setQueue(false);
                  resetTimer();
                  router.refresh();
                } else {
                  closeOpenMenus({}, true);
                }
              }}
              className="absolute right-8 top-8 z-20 block rounded-sm bg-black/30 p-2 xl:hidden"
            >
              <X className="size-5 text-white" />
            </button>
            <Image
              fill
              unoptimized
              src={InProgressGif}
              alt="In Progress"
              className="h-full w-full object-cover brightness-50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="relative flex h-fit w-full flex-col items-center justify-center gap-16 p-6 xl:h-full xl:w-[70%] xl:py-20">
            <button
              aria-label="Close Modal"
              onClick={() => {
                if (isDeleting && resetTimer) {
                  Animate.setQueue(false);
                  resetTimer();
                  router.refresh();
                } else {
                  closeOpenMenus({}, true);
                }
              }}
              className="absolute right-8 top-8 hidden xl:block"
            >
              <X className="size-10 text-white" />
            </button>
            <div className="flex h-fit w-full flex-col items-center justify-center gap-3">
              <h4 className="tracking-subtitle text-center text-lg font-bold text-green-500 md:text-xl xl:text-2xl">
                {" "}
                ONGOING GAME
              </h4>
              <p className="tracking-text text-center text-sm text-white/70 xl:text-base">
                You can continue to the game or delete the game
              </p>
            </div>
            <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
              <Button
                onClick={async () => {
                  if (isDeleting && resetTimer) {
                    Animate.setQueue(false);
                    resetTimer();
                    router.refresh();
                  }
                  if (!isDeleting) {
                    router.push("/pregame");
                  }
                }}
                className="w-full bg-green-500 text-xs text-white xl:w-fit xl:text-sm"
              >
                {isDeleting ? "RETURN" : "CONTINUE"} TO GAME
              </Button>
              <Button
                onClick={async () => {
                  await toast.promise(RemoveGameAction(), {
                    loading: "Deleting game...",
                    success: "Game deleted",
                    error: "Failed to delete game",
                  });

                  router.push("/");
                }}
                className="w-full bg-red-500 text-xs text-white xl:w-fit xl:text-sm"
              >
                DELETE GAME
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
