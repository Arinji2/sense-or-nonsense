"use client";

import { FightersList } from "@/../constants/fighters";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";

import { RemoveFighterAction } from "@/actions/game/fighters";
import { useFighterContext } from "@/app/fighters/context";
import { Button } from "@/components/button";
import { cn } from "../../utils/cn";
import useAnimate from "../../utils/useAnimate";
import { GameFighterSchemaType } from "../../validations/game-data/types";

export default function FighterFinalize({
  Animate,
  fighterData,
}: {
  Animate: ReturnType<typeof useAnimate>;
  fighterData: GameFighterSchemaType[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMultiplayer } = useFighterContext();

  const closeOpenMenus = useCallback(
    async (e: any, override?: boolean) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        const confirmation =
          override ??
          window.confirm(
            "Are you sure you want to cancel? All Selected Fighter Data will be Reset",
          );

        if (confirmation) {
          await RemoveFighterAction();
          toast.error("Fighter Selection Cancelled");

          Animate.setQueue(false);
          window.location.reload();
        } else {
          return;
        }
      }
    },
    [Animate],
  );

  const generatedFighters = useMemo(() => {
    if (!fighterData) return null;

    const data = fighterData.map((fighter) => {
      const fighterData = FightersList.find(
        (fighterList) => fighterList.id === fighter.fighter_id,
      )!;

      return fighterData;
    });

    return data;
  }, [fighterData]);

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

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100" : "opacity-0"
        } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
      >
        <div
          ref={containerRef}
          className="no-scrollbar group relative flex h-[80%] w-[90%] max-w-[1280px] flex-col items-center justify-start gap-10 overflow-hidden overflow-y-scroll rounded-md bg-custom-black py-10 md:h-[80%] xl:h-[500px] xl:w-[80%]"
        >
          <button
            aria-label="Close Modal"
            onClick={() => {
              closeOpenMenus({});
            }}
            className="absolute right-2 top-2 xl:right-8 xl:top-8"
          >
            <X className="size-10 text-white" />
          </button>
          <h4 className="tracking-subtitle pt-5 text-center text-base font-bold text-green-500 md:text-xl lg:text-2xl xl:pt-0">
            {" "}
            FINALIZE FIGHTER SELECTION
          </h4>
          <div
            className={cn(
              "no-scrollbar flex h-[200px] w-full flex-row items-center justify-center gap-10 overflow-x-auto overflow-y-hidden px-4 xl:px-10",
              {
                "justify-start xl:justify-center":
                  generatedFighters!.length > 1,
                "justify-start xl:justify-start": generatedFighters!.length > 2,
              },
            )}
          >
            {generatedFighters &&
              generatedFighters.map((fighter, index) => (
                <div
                  key={fighter.id + index}
                  className="flex h-fit w-[90%] shrink-0 flex-col items-center justify-center rounded-sm bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque] px-4 py-6 xl:w-[350px]"
                  style={
                    {
                      "--fighterColor": fighter.color,
                      "--fighterColorOpaque": fighter.color + "80",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex h-full w-full flex-row items-end justify-start gap-10">
                    <div className="flex size-[75px] shrink-0 flex-col items-start justify-center xl:size-[150px]">
                      <div className="relative h-full w-full overflow-hidden rounded-sm">
                        <Image
                          alt={fighterData![index].fighter_name ?? "Unknown"}
                          src={fighter.image}
                          fill
                          sizes="(min-width: 1280px) 150px, 75px"
                          className="object-contain opacity-80"
                        />
                      </div>
                    </div>
                    <div className="flex h-full w-full min-w-0 flex-col items-end justify-end gap-4">
                      <h4 className="w-full truncate text-right text-xs font-bold text-white md:text-lg">
                        {fighterData![index].fighter_name}
                      </h4>
                      <p className="text-xs text-white xl:text-sm">
                        PLAYER {index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-auto flex h-fit w-[80%] flex-col flex-wrap items-center justify-center gap-5 xl:w-fit xl:flex-row xl:gap-11">
            <Button
              onClick={() => {
                closeOpenMenus({}, true);
              }}
              className="w-full bg-red-500 text-white xl:w-fit"
            >
              RESET!
            </Button>
            <Button
              onClick={async () => {
                Animate.setQueue(false);
                const isRedirected = searchParams.get("redirected");
                const completed = searchParams.get("completed") === "backdrop";
                if (!isRedirected && !completed) {
                  router.push("/backdrop");
                }
                if (isRedirected === "true") {
                  router.replace("/pregame");
                }
                if (completed) {
                  router.push("/pregame");
                }
              }}
              className="w-full bg-green-500 text-white xl:w-fit"
            >
              LETS GO!
            </Button>
            {isMultiplayer && (
              <Button
                onClick={async () => {
                  Animate.setQueue(false);
                }}
                className="w-full bg-purple-500 text-xs text-white xl:w-fit xl:text-base"
              >
                CREATE PLAYER {fighterData.length + 1}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  );
}
