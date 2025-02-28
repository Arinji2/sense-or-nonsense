"use client";

import { SetupGameAction, SetupQuickPlayGame } from "@/actions/game/setup";
import { Button } from "@/components/button";
import useLoading from "@/hooks/useLoading";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import QuickPlayImage from "../../public/quickplay.webp";
import useAnimate from "../../utils/useAnimate";
import { GamesDataType } from "../../validations/generic/types";

export default function QuickplayModal({
  Animate,
  gameData,
}: {
  Animate: ReturnType<typeof useAnimate>;
  gameData: GamesDataType;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const closeOpenMenus = useCallback(
    (e: any) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        Animate.setQueue(false);
      }
    },
    [Animate],
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

    document.addEventListener("mousedown", closeOpenMenus);
    document.addEventListener("keydown", escHandler);

    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "unset";
    };
  }, [Animate.showComponent, closeOpenMenus]);

  const router = useRouter();

  const searchParams = useSearchParams();
  const { isGlobalLoading, startLoading, startAsyncLoading } = useLoading();
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
                Animate.setQueue(false);
              }}
              className="absolute right-8 top-8 z-20 block rounded-sm bg-black/30 p-2 xl:hidden"
            >
              <X className="size-5 text-white" />
            </button>
            <Image
              fill
              src={QuickPlayImage}
              alt="Login Image"
              className="h-full w-full object-cover object-top brightness-50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75 xl:object-center"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="relative flex h-fit w-full flex-col items-center justify-center gap-10 p-6 xl:h-full xl:w-[70%] xl:gap-16 xl:py-20">
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute right-8 top-8 hidden xl:block"
            >
              <X className="size-10 text-white" />
            </button>
            <h4 className="tracking-subtitle text-center text-lg font-bold text-green-500 md:text-xl xl:text-2xl">
              {" "}
              PLAY NOW OPTIONS
            </h4>
            <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:flex-nowrap xl:gap-10">
              <div className="flex h-fit w-fit flex-col items-center justify-start gap-6 xl:w-[50%]">
                <h3 className="text-whtie text-sm font-bold text-white xl:text-lg">
                  QUICK PLAY
                </h3>
                <p className="text-center text-xss text-white/70 xl:text-sm">
                  We will select the backdrop and fighter for you.
                </p>
                <Button
                  disabled={isGlobalLoading}
                  onClick={async () => {
                    await startAsyncLoading(async () => {
                      await toast.promise(
                        SetupQuickPlayGame(gameData.id.toString()),
                        {
                          loading: "Setting up quick play game...",
                          success: "Quick play game selected successfully!",
                          error: "Failed to select game",
                        },
                      );
                    });
                    startLoading(async () => {
                      router.push("/difficulty?redirected=true");
                    });
                  }}
                  className="w-full bg-purple-500 text-xs text-white xl:w-fit xl:text-sm"
                >
                  START
                </Button>
              </div>
              <div className="h-[2px] w-full bg-white/20 xl:h-full xl:w-[2px]"></div>
              <div className="flex h-fit w-fit flex-col items-center justify-start gap-6 xl:w-[50%]">
                <h3 className="text-whtie text-sm font-bold text-white xl:text-lg">
                  CUSTOM PLAY
                </h3>
                <p className="text-center text-xss text-white/70 xl:text-sm">
                  You will select the backdrop and fighter yourself.
                </p>
                <Button
                  disabled={isGlobalLoading}
                  onClick={async () => {
                    startAsyncLoading(async () => {
                      await toast.promise(
                        SetupGameAction(gameData.id.toString()),
                        {
                          loading: "Setting up custom game...",
                          success: "Custom game selected successfully!",
                          error: "Failed to select game",
                        },
                      );
                    });

                    startLoading(async () => {
                      const isRedirected = searchParams.get("redirected");
                      if (isRedirected && isRedirected === "true") {
                        router.replace("/pregame");
                        return;
                      }
                      router.push("/difficulty");
                    });
                  }}
                  className="w-full bg-blue-500 text-xs text-white xl:w-fit xl:text-sm"
                >
                  START
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
