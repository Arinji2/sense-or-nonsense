import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { GetUserMode } from "../../../utils/getMode";
import GamemodeSelector from "./gamemode-selector.client";

export default function Hero() {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-stretch justify-start gap-20 py-5 md:h-[100svh]">
      <div className="fixed left-0 top-0 h-[100svh] w-full">
        <Image
          src="/home/home.png"
          quality={30}
          alt="Books"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="z-10 h-full w-full bg-[#1E1E1E]/70 backdrop-blur-sm"></div>
      </div>

      <div
        style={{
          minHeight: "inherit",
        }}
        className="z-10 flex h-full w-full flex-col items-center justify-start gap-20 px-4 py-10"
      >
        <Suspense fallback={<></>}>
          <HeroHeader />
        </Suspense>
        <div className="z-10 mt-auto flex h-fit w-full flex-col items-center justify-center gap-8">
          <h2 className="text-center text-xl font-bold tracking-title text-purple-500 md:text-2xl xl:text-3xl">
            ABOUT THE GAME
          </h2>
          <p className="max-w-[800px] text-center text-xs text-white/70 md:text-base">
            You will be given a <span className="text-red-500">word</span> and
            its <span className="text-emerald-500">definition</span>, you need
            to figure out if this word makes{" "}
            <span className="text-yellow-500">sense</span> or{" "}
            <span className="text-lime-500">not</span>
          </p>
          <ChevronDown className="size-10 animate-bounce text-white" />
        </div>
      </div>
    </div>
  );
}

export async function HeroHeader() {
  const { userID } = await GetUserMode();
  return (
    <div className="z-10 flex h-fit w-full flex-col items-center justify-center gap-4 md:gap-8">
      <h1 className="text-center text-2xl font-bold leading-relaxed tracking-title text-white md:text-3xl md:tracking-title xl:text-5xl">
        <span className="block text-green-500 md:inline">SENSE</span> OR{" "}
        <span className="block text-red-500 md:inline">NONSENSE</span>
      </h1>
      <p className="text-center text-sm text-white/70 md:text-lg">
        "Mandela Effect on basic English Words amplified"
      </p>
      <div className="flex h-fit w-full flex-col items-center justify-center gap-6 py-8 md:flex-row">
        <GamemodeSelector
          className="w-full bg-green-500 md:w-fit"
          tag="single"
          isLoggedIn={userID !== null}
        >
          <p className="text-base font-bold tracking-title text-white md:text-sm">
            SINGLE PLAYER
          </p>
        </GamemodeSelector>
        <GamemodeSelector
          className="w-full bg-teal-500 md:w-fit"
          tag="multi"
          isLoggedIn={userID !== null}
        >
          <p className="text-base font-bold tracking-title text-white md:text-sm">
            MULTI PLAYER
          </p>
        </GamemodeSelector>
      </div>
    </div>
  );
}
