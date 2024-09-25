"use client";

import { FightersList } from "@/app/fighters/fighters";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";

import { RemoveFighterAction } from "@/actions/game/fighters";
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
            "Are you sure you want to cancel? The Selected Fighter Data will be Reset",
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
    [Animate, containerRef],
  );

  const generatedFighters = useMemo(() => {
    if (!fighterData) return null;

    const data = fighterData.map((fighter) => {
      const fighterData = FightersList.find(
        (fighterList) => fighterList.id === Number.parseInt(fighter.fighter_id),
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

    document.addEventListener("mousedown", closeOpenMenus);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Animate.showComponent]);

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
          <h4 className="text-center text-[20px] font-bold tracking-subtitle text-green-500 md:text-[35px]">
            {" "}
            FINALIZE FIGHTER SELECTION
          </h4>
          <div className="flex h-full w-full flex-row flex-wrap items-center justify-center gap-10 px-10">
            {generatedFighters &&
              generatedFighters.map((fighter, index) => (
                <div
                  key={fighter.id + index}
                  className="flex h-fit w-fit max-w-[400px] flex-col items-center justify-center rounded-sm bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque] px-4 py-6"
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
                    <div className="flex h-full w-full min-w-0 flex-col items-start justify-end gap-4">
                      <h4 className="w-full truncate text-left text-[15px] font-bold text-white md:text-[20px]">
                        {fighterData![index].fighter_name}{" "}
                      </h4>
                      <p className="text-[15px] text-white">
                        PLAYER {index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-auto flex h-fit w-[80%] flex-col flex-wrap items-center justify-center gap-5 xl:w-fit xl:flex-row xl:gap-11">
            <button
              onClick={() => {
                closeOpenMenus({}, true);
              }}
              className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-red-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
            >
              RESET!
            </button>
            <button
              onClick={async () => {
                Animate.setQueue(false);
                const isRedirected = searchParams.get("redirected");
                if (isRedirected && isRedirected === "true") {
                  router.replace("/pregame");
                } else router.push("/backdrop");
              }}
              className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-green-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
            >
              LETS GO!
            </button>
          </div>
        </div>
      </div>
    )
  );
}
