"use client";

import { FightersList } from "@/app/fighters/fighters";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  DecryptGameDataAction,
  EncryptGameDataAction,
} from "../../utils/game-data";
import useAnimate from "../../utils/useAnimate";
import { GameFighterSchemaType } from "../../validations/game-data/types";

export default function FighterFinalize({
  Animate,
}: {
  Animate: ReturnType<typeof useAnimate>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fighterData, setFighterData] = useState<
    GameFighterSchemaType[] | null
  >(null);
  const router = useRouter();

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
            "Are you sure you want to cancel? The Selected Fighter Data will be Reset"
          );

        if (confirmation) {
          toast.error("Fighter Selection Cancelled");
          await EncryptGameDataAction({
            key: "fighter_data",
            value: "",
            deleteKey: true,
          });

          Animate.setQueue(false);
          window.location.reload();
        } else {
          return;
        }
      }
    },
    [Animate, containerRef]
  );

  const generatedFighters = useMemo(() => {
    if (!fighterData) return null;

    const data = fighterData.map((fighter) => {
      const fighterData = FightersList.find(
        (fighterList) => fighterList.id === Number.parseInt(fighter.fighter_id)
      )!;

      return fighterData;
    });

    return data;
  }, [fighterData]);

  useEffect(() => {
    if (!Animate.queue) return;

    (async () => {
      const gameData = await DecryptGameDataAction();

      if (!gameData.fighter_data || !Array.isArray(gameData.fighter_data)) {
        return router.push("/fighters");
      }

      setFighterData(gameData.fighter_data!);
    })();
  }, [Animate.queue, router]);
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
          Animate.showComponent ? "opacity-100 " : " opacity-0 "
        } w-full h-[100svh]  transition-all duration-700 ease-in-out fixed top-0  z-[1500] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
      >
        <div
          ref={containerRef}
          className="w-[90%] max-w-[1280px] overflow-y-scroll no-scrollbar xl:w-[80%] relative  md:h-[80%] h-[80%] flex flex-col group  items-center justify-start gap-10 py-10 xl:h-[500px] bg-custom-black overflow-hidden rounded-md "
        >
          <button
            aria-label="Close Modal"
            onClick={() => {
              closeOpenMenus({});
            }}
            className="absolute top-2 xl:top-8 right-2 xl:right-8"
          >
            <X className="size-10 text-white" />
          </button>
          <h4 className="font-bold text-[20px] md:text-[35px] text-center tracking-subtitle  text-green-500">
            {" "}
            FINALIZE FIGHTER SELECTION
          </h4>
          <div className="w-full h-full flex flex-row items-center justify-center gap-10 flex-wrap px-10">
            {generatedFighters &&
              generatedFighters.map((fighter, index) => (
                <div
                  key={fighter.id + index}
                  className="w-fit max-w-[400px] h-fit py-6 px-4 bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque]  rounded-sm flex flex-col items-center justify-center"
                  style={
                    {
                      "--fighterColor": fighter.color,
                      "--fighterColorOpaque": fighter.color + "80",
                    } as React.CSSProperties
                  }
                >
                  <div className="w-full  h-full flex flex-row items-end justify-start gap-10">
                    <div className=" xl:size-[150px] size-[75px] shrink-0 flex flex-col items-start justify-center">
                      <div className="relative w-full h-full rounded-sm overflow-hidden">
                        <Image
                          alt={fighterData![index].fighter_name ?? "Unknown"}
                          src={fighter.image}
                          fill
                          sizes="(min-width: 1280px) 150px, 75px"
                          className="opacity-80 object-contain"
                        />
                      </div>
                    </div>
                    <div className="w-full  h-full flex flex-col min-w-0 items-start justify-end gap-4">
                      <h4 className="font-bold text-[15px] w-full text-left truncate  md:text-[20px] text-white">
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
          <div className="w-[80%] xl:w-fit h-fit  flex flex-wrap flex-col xl:flex-row items-center justify-center gap-5 xl:gap-11 mt-auto">
            <button
              onClick={() => {
                closeOpenMenus({}, true);
              }}
              className="xl:w-fit  w-full shrink-0 h-fit will-change-transform text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-red-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
            >
              RESET!
            </button>
            <button
              onClick={async () => {
                router.push("/backdrop");
              }}
              className="xl:w-fit  w-full shrink-0 h-fit will-change-transform text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-green-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
            >
              LETS GO!
            </button>
          </div>
        </div>
      </div>
    )
  );
}
