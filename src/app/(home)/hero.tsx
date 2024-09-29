import { Button } from "@/components/button";
import WidthWrapper from "@/wrappers/width-wrapper";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start gap-20 py-5 md:h-[100svh]">
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
      <WidthWrapper>
        <div className="flex h-full w-full flex-col items-center justify-start gap-20 px-4">
          <HeroHeader />
          <div className="z-10 mt-auto flex h-fit w-full flex-col items-center justify-center gap-4">
            <h2 className="text-center text-[25px] font-bold tracking-subtitle text-purple-500 md:text-[30px] xl:text-[40px]">
              ABOUT THE GAME
            </h2>
            <p className="max-w-[800px] text-center text-[16px] tracking-text text-white/70 md:text-[20px]">
              You will be given a <span className="text-red-500">word</span> and
              its <span className="text-emerald-500">definition</span>, you need
              to figure out if this word makes{" "}
              <span className="text-yellow-500">sense</span> or{" "}
              <span className="text-lime-500">not</span>
            </p>
            <ChevronDown className="size-10 animate-bounce text-white" />
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}

export function HeroHeader() {
  return (
    <div className="z-10 flex h-fit w-full flex-col items-center justify-center gap-4 md:gap-2">
      <h1 className="text-center text-[30px] font-bold tracking-subtitle text-white md:text-[40px] md:tracking-title xl:text-[60px]">
        <span className="block text-green-500 md:inline">SENSE</span> OR{" "}
        <span className="block text-red-500 md:inline">NONSENSE</span>
      </h1>
      <p className="text-center text-sm tracking-text text-white/70 md:text-[20px]">
        "Mandela Effect on basic English Words amplified"
      </p>
      <div className="flex h-fit w-full flex-col items-center justify-center gap-6 py-8 md:flex-row">
        <Button className="w-full bg-green-500 md:w-fit">
          <p className="text-base font-semibold text-white md:text-xl">
            SINGLE PLAYER
          </p>
        </Button>
        <Button className="w-full bg-teal-500 md:w-fit">
          <p className="text-base font-semibold text-white md:text-xl">
            MULTI PLAYER
          </p>
        </Button>
      </div>
    </div>
  );
}
