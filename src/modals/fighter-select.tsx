"use client";

import { FightersList } from "@/app/fighters/fighters";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import {
  DecryptGameDataAction,
  EncryptGameDataAction,
} from "../../utils/game-data";
import useAnimate from "../../utils/useAnimate";
import { GameFighterSchemaType } from "../../validations/game-data/types";
import { COOPSupportForFighterSelect } from "../../validations/generic/types";

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

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100 " : " opacity-0 "
        } w-full h-[100svh]  transition-all duration-700 ease-in-out fixed top-0  z-[1500] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
      >
        <div
          ref={containerRef}
          className="w-[90%] max-w-[1280px] xl:w-[80%] md:h-[80%] h-[80%] flex flex-col group xl:flex-row items-center justify-start gap-5 xl:h-[400px] bg-custom-black overflow-hidden rounded-md "
        >
          <div className="w-full xl:w-[30%] xl:h-full h-[40%] relative overflow-hidden">
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute xl:hidden block p-2 bg-black/30 z-20 rounded-sm top-8 right-8"
            >
              <X className="size-5 text-white" />
            </button>
            <Image
              fill
              src={
                FightersList.find((fighter) => fighter.id === fighterID)?.image!
              }
              alt="Login Image"
              className="object-cover w-full h-full brightness-50 group-hover:brightness-75 group-hover:scale-110 transition-all duration-500 ease-in-out"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="w-full relative xl:w-[70%] xl:h-full h-fit flex flex-col items-center justify-center  xl:py-20  gap-10  p-6 ">
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute xl:block hidden top-8 right-8"
            >
              <X className="size-10 text-white" />
            </button>
            <h4 className="font-bold text-[20px] md:text-[35px] text-center tracking-subtitle  text-green-500">
              {" "}
              SETUP FIGHTER FOR PLAYER {multiplayerSupport.currentPlayer}
            </h4>
            <div className="w-full max-w-[400px] h-fit flex flex-col items-start justify-center gap-2">
              <p className="text-[15px] font-medium text-white">NAME:</p>
              <input
                type="text"
                maxLength={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 rounded-sm outline-none h-10 bg-transparent border-b-2 border-white/50 text-white"
              />
            </div>
            <div className="w-fit h-fit flex flex-wrap flex-row items-center justify-center gap-5 xl:gap-10 ">
              <button
                disabled={name.length === 0}
                onClick={async () => {
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
                      Animate.setQueue(false);
                      setName("");
                      router.push("/level");
                      return;
                    }
                  }

                  await EncryptGameDataAction({
                    key: "fighter_data",
                    value: JSON.stringify([characterData]),
                  });

                  Animate.setQueue(false);
                  setName("");
                  router.push("/level");
                }}
                className={cn(
                  {
                    "xl:w-fit  w-full shrink-0 h-fit text-[15px] opacity-100 xl:text-[20px] hover:scale-100 scale-105 transition-all ease-in-out duration-200  bg-blue-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center":
                      true,
                  },
                  { "opacity-0": name.length === 0 }
                )}
              >
                Create {name}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
