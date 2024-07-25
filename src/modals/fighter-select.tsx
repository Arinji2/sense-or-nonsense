"use client";

import { FightersList } from "@/app/fighters/fighters";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";
import {
  DecryptGameDataAction,
  EncryptGameDataAction,
} from "../../utils/game-data";
import useAnimate from "../../utils/useAnimate";
import { GameFighterSchemaType } from "../../validations/game-data/types";
import { COOPSupportForFighterSelect } from "../../validations/generic/types";
import FighterFinalize from "./fighter-finalize";

export default function FighterModal({
  Animate,
  fighterID,
  multiplayerSupport,
  setMultiplayerSupport,
}: {
  Animate: ReturnType<typeof useAnimate>;
  fighterID: number;
  multiplayerSupport: COOPSupportForFighterSelect;
  setMultiplayerSupport: React.Dispatch<
    React.SetStateAction<COOPSupportForFighterSelect>
  >;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", closeOpenMenus);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Animate.showComponent]);

  const closeOpenMenus = (e: any) => {
    if (
      containerRef.current &&
      Animate.showComponent &&
      !containerRef.current.contains(e.target)
    ) {
      Animate.setQueue(false);
    }
  };

  const router = useRouter();
  const finalizeAnimate = useAnimate(800);

  return (
    <>
      {createPortal(
        <FighterFinalize Animate={finalizeAnimate} />,
        document.body,
      )}
      {Animate.actualState && (
        <div
          className={`${
            Animate.showComponent ? "opacity-100" : "opacity-0"
          } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
        >
          <div
            ref={containerRef}
            className="group flex h-[80%] w-[70%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-custom-black md:h-[80%] md:w-[50%] xl:h-[400px] xl:w-[80%] xl:flex-row"
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
                src={
                  FightersList.find((fighter) => fighter.id === fighterID)
                    ?.image!
                }
                alt="Login Image"
                className="h-full w-full object-cover brightness-[.3] transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75 md:object-contain xl:object-cover"
                sizes="(min-width: 1280px) 500px, 80%"
                priority
              />
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name) return;
                const characterData = {
                  fighter_id: fighterID.toString(),
                  fighter_name: name,
                } as GameFighterSchemaType;
                if (multiplayerSupport.supported) {
                  if (multiplayerSupport.currentPlayer === 1) {
                    await EncryptGameDataAction({
                      key: "fighter_data",
                      value: JSON.stringify([characterData]),
                    });
                    toast.success("Player 1 Created");
                    Animate.setQueue(false);
                    setName("");
                    setMultiplayerSupport({
                      supported: true,
                      currentPlayer: 2,
                    });
                    return;
                  } else {
                    const data = await DecryptGameDataAction();
                    if (
                      !data.fighter_data ||
                      !Array.isArray(data.fighter_data)
                    ) {
                      router.push("/fighters");
                      return;
                    }
                    await EncryptGameDataAction({
                      key: "fighter_data",
                      value: JSON.stringify([
                        ...data.fighter_data,
                        characterData,
                      ]),
                    });
                    finalizeAnimate.setQueue(true);
                    Animate.setQueue(false);
                    toast.success("Player 2 Created");
                    setName("");

                    return;
                  }
                }

                await EncryptGameDataAction({
                  key: "fighter_data",
                  value: JSON.stringify([characterData]),
                });
                toast.success("Player Created");
                finalizeAnimate.setQueue(true);
                Animate.setQueue(false);

                setName("");
              }}
              className="relative flex h-fit w-full flex-col items-center justify-center gap-10 p-6 xl:h-full xl:w-[70%] xl:py-20"
            >
              <button
                aria-label="Close Modal"
                onClick={() => {
                  Animate.setQueue(false);
                }}
                className="absolute right-8 top-8 hidden xl:block"
              >
                <X className="size-10 text-white" />
              </button>
              <h4 className="text-center text-[20px] font-bold tracking-subtitle text-green-500 md:text-[35px]">
                {" "}
                SETUP FIGHTER FOR PLAYER {multiplayerSupport.currentPlayer}
              </h4>
              <div className="flex h-fit w-full max-w-[400px] flex-col items-start justify-center gap-2">
                <p className="text-[15px] font-medium text-white">NAME:</p>
                <input
                  type="text"
                  maxLength={15}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-sm border-b-2 border-white/50 bg-transparent py-2 text-white outline-none"
                />
              </div>
              <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
                <button
                  type="submit"
                  disabled={name.length === 0}
                  className={cn(
                    {
                      "flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-blue-500 p-2 text-[15px] text-white opacity-100 transition-all duration-200 ease-in-out hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]":
                        true,
                    },
                    { "opacity-0": name.length === 0 },
                  )}
                >
                  Create {name}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
