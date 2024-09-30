import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { GetUserMode } from "../../../utils/getMode";
import GamemodeSelector from "./gamemode-selector.client";
import { InstructionButton } from "./instructions.client";

export default function Instructions() {
  return (
    <div className="z-10 flex h-fit w-full flex-col items-center justify-start bg-[#2C2828] py-10">
      <div className="flex h-full max-w-full-page flex-col items-center justify-start gap-8 px-4 xl:w-[80%] xl:px-0">
        <div className="flex h-fit w-full flex-col items-start justify-start">
          <h2 className="text-center text-xl font-bold tracking-title text-blue-500 md:text-3xl xl:text-5xl">
            HOW TO PLAY
          </h2>
        </div>
        <div className="flex h-fit w-full flex-col items-center justify-start gap-8 xl:gap-20">
          <Step1 />
          <div className="h-[2px] w-full bg-white/10"></div>
          <Step2 />
          <div className="h-[2px] w-full bg-white/10"></div>
          <Suspense fallback={<></>}>
            <Step3 />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function InstructionWordItem({
  word,
  definition,
  isFake,
}: {
  word: string;
  definition: string;
  isFake: boolean;
}) {
  return (
    <div className="relative flex h-auto w-fit flex-col items-center justify-center gap-1">
      <div className="absolute -top-9 right-0 h-fit w-fit rotate-[20deg] rounded-md bg-purple-500 px-3 py-1 xl:-right-6 xl:-top-6">
        <p className="tracking-text text-[10px] font-bold text-white">
          {isFake ? "FAKE" : "REAL"}
        </p>
      </div>
      <p className="text-center text-lg font-bold tracking-title text-white md:text-lg xl:text-xl">
        {word}
      </p>
      <div className="h-full w-fit rounded-md bg-[#FCAB3A] px-3 py-2">
        <p className="text-center text-[10px] font-medium text-[#3F3939] md:text-xs xl:text-sm">
          {definition}
        </p>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="flex h-full w-full flex-col items-end justify-end gap-14 xl:flex-row xl:items-end xl:gap-6">
      <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-2 xl:h-full xl:w-fit xl:items-end">
        <p className="text-2xl font-bold leading-none tracking-number text-purple-500 md:text-4xl xl:min-w-[60x] xl:text-6xl">
          1.
        </p>
        <p className="text-xss text-left text-white md:text-xs xl:w-[300px] xl:text-sm">
          You will be given a word and its definition. You will have to decide
          if the word makes sense or not.
        </p>
      </div>
      <div className="flex h-fit w-[95%] flex-col items-center justify-between gap-16 px-4 md:flex-row md:gap-10 xl:w-full xl:items-stretch xl:gap-8 xl:px-0">
        <InstructionWordItem
          word="POLYHISTOR"
          definition="A person of vast knowledge in many fields."
          isFake={false}
        />
        <InstructionWordItem
          word="CENESTHETIC"
          definition="Feeling a sense of shared collective existence."
          isFake={true}
        />
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="mt-auto flex h-full w-full flex-col items-start justify-center">
      <div className="mt-auto flex h-full w-full flex-col items-start justify-start gap-8 xl:w-[950px] xl:flex-row xl:items-stretch xl:gap-6">
        <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-end gap-2 xl:h-full xl:items-center">
          <p className="text-2xl font-bold leading-none tracking-number text-purple-500 md:text-4xl xl:min-w-[60x] xl:text-6xl">
            2.
          </p>
          <p className="text-xss text-left text-white md:text-xs xl:w-[300px] xl:text-sm">
            You can enter your decision using the buttons.
          </p>
        </div>
        <div className="flex h-full w-[95%] flex-row items-center justify-center gap-16 px-4 pl-8 md:gap-10 md:pl-4 xl:w-[214px] xl:justify-between xl:gap-20 xl:px-0 xl:pr-0">
          <InstructionButton isFake={false} />
          <InstructionButton isFake={true} />
        </div>
      </div>
    </div>
  );
}

async function Step3() {
  const { userID } = await GetUserMode();
  return (
    <div className="mb-auto flex h-fit w-full flex-col items-stretch justify-center gap-6 xl:flex-row">
      <div className="flex h-fit w-full flex-col items-start justify-start gap-8 xl:w-[950px] xl:flex-row xl:items-stretch xl:gap-6">
        <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-2 xl:h-full xl:items-end">
          <p className="xlmin-:w-60px] text-2xl font-bold leading-none tracking-number text-purple-500 md:text-4xl xl:text-6xl">
            3.
          </p>
          <p className="text-xss text-left text-white md:text-xs xl:w-[300px] xl:text-sm">
            This is the timer, dont let it reach{" "}
            <span className="text-yellow-500">0</span>. You get a total of{" "}
            <span className="text-yellow-500">10</span> seconds to make your
            decision.
          </p>
        </div>
        <div className="mt-auto flex h-fit w-[95%] flex-row items-center justify-center gap-6 px-4 pl-8 md:gap-10 md:pl-4 xl:w-[214px] xl:items-stretch xl:justify-start xl:gap-8 xl:px-0">
          <div className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-full bg-black">
            <p className="tracking-text text-center text-2xl tracking-number text-yellow-500 md:text-2xl">
              10
            </p>
          </div>
          <div className="flex h-auto w-fit flex-col items-center justify-center">
            <ArrowRight className="size-[30px] animate-bounce-right text-purple-500" />
          </div>

          <div className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-full bg-black">
            <p className="tracking-text text-center text-2xl tracking-number text-yellow-500 md:text-2xl">
              0
            </p>
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full shrink-0 bg-white/10 xl:h-auto xl:w-[2px]"></div>
      <div className="flex h-full w-full flex-col items-center justify-between gap-6 xl:flex-row xl:items-end xl:gap-2">
        <div className="flex h-fit w-fit flex-col items-center justify-center gap-4 xl:items-start xl:gap-2">
          <h4 className="whitespace-nowrap text-lg font-bold tracking-title text-white xl:text-2xl">
            THATS IT!
          </h4>
          <p className="text-center text-xs text-white/50 xl:text-left xl:text-xs">
            Start playing and improving{" "}
            <span className="inline">your English. Remember, </span>{" "}
            <span className="inline text-[#EC4899] xl:block">
              practice makes perfect.
            </span>
          </p>
        </div>

        <GamemodeSelector
          className="bg-green-500 px-3 py-2 xl:px-3"
          tag="single"
          isLoggedIn={userID !== null}
        >
          <p className="whitespace-nowrap text-xs font-bold text-white">
            START PLAYING
          </p>
        </GamemodeSelector>
      </div>
    </div>
  );
}
