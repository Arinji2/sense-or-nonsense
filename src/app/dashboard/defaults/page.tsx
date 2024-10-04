import { BackdropsList } from "@/app/backdrop/backdrops";
import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { FightersList } from "../../../../constants/fighters";
import { GetUserMode } from "../../../../utils/getMode";
import { StringifiedGameFighterSchema } from "../../../../validations/game-data/schema";
import { GameFighterSchemaType } from "../../../../validations/game-data/types";
import {
  BackdropDataType,
  FighterDataType,
} from "../../../../validations/generic/types";
import { AccountSchema } from "../../../../validations/pb/schema";
import { BackdropReset, FighterReset } from "./fighter.client";

export default async function Page() {
  const { mode, pb, userID } = await GetUserMode();
  if (userID === null) {
    redirect("/");
  }
  let fighterData: GameFighterSchemaType | null = null;
  let selectedFighterData: FighterDataType | null = null;
  let backdropData: BackdropDataType | null = null;

  if (mode === "guest") redirect("/");

  if (mode === "user") {
    const parsedAccount = AccountSchema.safeParse(pb.authStore.model!);
    if (parsedAccount.success) {
      const parse = StringifiedGameFighterSchema.safeParse(
        parsedAccount.data.default_fighter,
      );
      if (parse.success) {
        const isValid = FightersList.find(
          (fighter) => fighter.id === parse.data.fighter_id,
        );
        if (isValid) {
          fighterData = {
            fighter_uid: parse.data.fighter_uid,
            fighter_id: parse.data.fighter_id,
            fighter_name: parse.data.fighter_name,
          };

          selectedFighterData = FightersList.find(
            (fighter) => fighter.id === parse.data.fighter_id,
          )!;
        }
      }

      if (parsedAccount.data.default_backdrop !== 0) {
        const isValid = BackdropsList.find(
          (backdrop) => backdrop.id === parsedAccount.data.default_backdrop,
        );

        if (isValid) {
          backdropData = {
            id: parsedAccount.data.default_backdrop,
            name: isValid.name,
            image: isValid.image,
          };
        }
      }
    }
  }

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-10 px-4 py-5 xl:px-0 xl:py-10"
      >
        <h1 className="text-base font-bold leading-relaxed tracking-title text-white md:text-xl">
          <Link
            href="/dashboard"
            className="block text-white/50 md:inline xl:text-lg"
          >
            DASHBOARD
          </Link>
          /DEFAULTS
        </h1>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="flex h-full w-full flex-col items-center justify-start gap-10"
        >
          <div className="flex h-full w-full flex-col items-start justify-start gap-4">
            <p className="text-sm font-bold tracking-title text-white md:text-base xl:text-lg">
              DEFAULT FIGHTER:
            </p>
            {selectedFighterData ? (
              <div
                style={
                  {
                    "--fighterColor":
                      selectedFighterData.secondaryColor ??
                      selectedFighterData.color,
                  } as React.CSSProperties
                }
                className="group flex h-fit w-full flex-col items-start justify-start gap-4 rounded-md bg-[--fighterColor] p-4 xl:h-full xl:flex-row xl:items-center"
              >
                <div className="relative size-[100px] shrink-0 xl:h-full xl:w-[30%]">
                  <Image
                    src={selectedFighterData.transparentImage}
                    alt={`${selectedFighterData.name} Fighter`}
                    fill
                    sizes="(min-width: 1280px) 300px, 200px"
                    className="h-full w-full object-contain brightness-[.5] transition-all duration-500 ease-in-out group-hover:brightness-75"
                  />
                </div>
                <div className="flex h-full w-full flex-col items-start justify-end gap-4 xl:gap-8">
                  <p className="line-clamp-2 text-lg text-white/70 md:text-xl xl:text-2xl">
                    <span className="text-white">Name:</span>{" "}
                    {selectedFighterData.name}
                  </p>
                  <p className="line-clamp-3 text-xs text-white/70 md:text-sm xl:text-base">
                    <span className="text-white">Short Lore:</span>{" "}
                    {selectedFighterData.lore.short}
                  </p>
                  <div className="flex h-fit w-full flex-col items-center justify-center gap-3 pt-5 xl:flex-row xl:justify-start xl:pt-0">
                    <FighterReset />
                    <Link href="/fighters?setDefaults=true">
                      <Button className="w-full bg-green-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit">
                        Set New Default
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5 rounded-md bg-blue-500/20 p-4 xl:h-full xl:gap-8">
                <p className="text-sm font-bold tracking-title text-white md:text-base xl:text-lg">
                  SET A NEW FIGHTER
                </p>
                <Link href="/fighters?setDefaults=true">
                  <Button className="w-full bg-green-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit">
                    Set New Default
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-4">
            <p className="text-sm font-bold tracking-title text-white md:text-base xl:text-lg">
              DEFAULT BACKDROP:
            </p>
            {backdropData ? (
              <div className="group relative flex h-[500px] w-full flex-col items-start justify-end overflow-hidden rounded-md p-4 xl:h-full">
                <Image
                  src={backdropData.image}
                  alt={`${backdropData.name} Backdrop`}
                  fill
                  sizes="100vw"
                  className="absolute h-full w-full object-cover brightness-[.5] transition-all duration-500 ease-in-out group-hover:brightness-75"
                />
                <div className="absolute left-0 top-0 h-full w-full bg-black/60 backdrop-blur-[1px]"></div>
                <div className="z-20 flex h-fit w-full flex-col items-start justify-between gap-4 xl:flex-row">
                  <p className="line-clamp-2 text-sm text-white/70 md:text-lg xl:text-xl">
                    <span className="text-white">Name:</span>{" "}
                    {backdropData.name}
                  </p>
                  <div className="flex h-fit w-full flex-col items-center justify-center gap-3 pt-5 xl:w-fit xl:flex-row xl:justify-start xl:pt-0">
                    <BackdropReset />
                    <Link href="/backdrop?setDefaults=true">
                      <Button className="w-full bg-green-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit">
                        Set New Default
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5 rounded-md bg-purple-500/20 p-4 xl:h-full xl:gap-8">
                <p className="text-sm font-bold tracking-title text-white md:text-base xl:text-lg">
                  SET A NEW BACKDROP
                </p>

                <Link href="/backdrop?setDefaults=true">
                  <Button className="w-full bg-green-500/40 px-3 py-2 text-xs text-white md:text-sm xl:w-fit">
                    Set New Default
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
