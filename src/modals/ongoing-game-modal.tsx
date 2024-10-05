"use client";

import { RemoveGameAction } from "@/actions/game/setup";
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
}: {
  Animate: ReturnType<typeof useAnimate>;
  isDeleting?: boolean;
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
    [Animate, containerRef, router],
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
                if (isDeleting) {
                  Animate.setQueue(false);
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
                if (isDeleting) {
                  Animate.setQueue(false);
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
              <h4 className="tracking-subtitle text-center text-[20px] font-bold text-green-500 md:text-[35px]">
                {" "}
                ONGOING GAME
              </h4>
              <p className="tracking-text text-center text-[20px] text-white">
                You can continue to the game or delete the game
              </p>
            </div>
            <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
              <button
                onClick={async () => {
                  Animate.setQueue(false);
                  router.refresh();
                }}
                className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-purple-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
              >
                {isDeleting ? "RETURN" : "CONTINUE"} TO GAME
              </button>
              <button
                onClick={async () => {
                  closeOpenMenus({}, true);
                }}
                className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-blue-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
              >
                DELETE GAME
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
