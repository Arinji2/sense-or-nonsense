import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";
import { InstructionButton } from "./instructions.client";

export default function Instructions() {
  return (
    <div className="z-10 flex h-fit w-full flex-col items-center justify-start bg-[#2C2828] py-10">
      <div className="max-w-full-page flex h-full flex-col items-center justify-start gap-8 px-4 xl:w-[80%] xl:px-0">
        <div className="flex h-fit w-full flex-col items-start justify-start">
          <h2 className="text-center text-[25px] font-bold tracking-subtitle text-blue-500 md:text-[30px] xl:text-[50px]">
            HOW TO PLAY
          </h2>
        </div>
        <div className="flex h-fit w-full flex-col items-center justify-start gap-8">
          <Step1 />
          <div className="h-[2px] w-full bg-white/10"></div>
          <Step2 />
          <div className="h-[2px] w-full bg-white/10"></div>
          <Step3 />
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
    <div className="relative flex h-fit w-fit flex-col items-center justify-center gap-1">
      <div className="absolute -top-5 right-3 h-fit w-fit rotate-[20deg] rounded-md bg-purple-500 px-3 py-1 xl:-right-3 xl:-top-3">
        <p className="text-[10px] font-bold tracking-text text-white">
          {isFake ? "FAKE" : "REAL"}
        </p>
      </div>
      <p className="text-center text-[15px] font-bold tracking-text text-white md:text-[20px] xl:text-[25px]">
        {word}
      </p>
      <div className="h-full w-fit rounded-md bg-[#FCAB3A] px-3 py-2">
        <p className="text-center text-[10px] tracking-text text-[#3F3939] md:text-[14px] xl:text-[16px]">
          {definition}
        </p>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="flex h-full w-full flex-col items-end justify-end gap-14 xl:flex-row xl:items-end xl:gap-0">
      <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-2 xl:h-full xl:w-fit xl:items-end">
        <p className="text-[30px] font-bold leading-none text-purple-500 md:text-[40px] xl:w-[52px] xl:text-[60px]">
          1.
        </p>
        <p className="text-left text-[13px] font-medium tracking-text text-white md:text-[13px] xl:w-[350px] xl:text-[15px]">
          You will be given a word and its definition. You will have to decide
          if the word makes sense or not.
        </p>
      </div>
      <div className="flex h-full w-[95%] flex-col items-center justify-between gap-16 px-4 md:flex-row md:gap-10 xl:w-full xl:items-end xl:gap-8 xl:px-0">
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
      <div className="mt-auto flex h-full w-full flex-col items-start justify-start gap-8 xl:w-[950px] xl:flex-row xl:items-stretch xl:gap-0">
        <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-end gap-2 xl:h-full xl:items-center">
          <p className="text-[30px] font-bold leading-none text-purple-500 md:text-[40px] xl:w-[52px] xl:text-[60px]">
            2.
          </p>
          <p className="text-left text-[13px] font-medium tracking-text text-white md:text-[13px] xl:w-[350px] xl:pr-2 xl:text-[15px]">
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

function Step3() {
  return (
    <div className="mt-auto flex h-fit w-full flex-col items-stretch justify-center gap-6 xl:flex-row">
      <div className="flex h-fit w-full flex-col items-start justify-start gap-8 xl:w-[950px] xl:flex-row xl:items-stretch xl:gap-0">
        <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-2 xl:h-full xl:items-end">
          <p className="text-[30px] font-bold leading-none text-purple-500 md:text-[40px] xl:w-[52px] xl:text-[60px]">
            3.
          </p>
          <p className="text-left text-[13px] font-medium tracking-text text-white md:text-[13px] xl:w-[350px] xl:text-[15px]">
            This is the timer, dont let it reach{" "}
            <span className="text-yellow-500">0</span>. You get a total of{" "}
            <span className="text-yellow-500">10</span> seconds to make your
            decision.
          </p>
        </div>
        <div className="mt-auto flex h-fit w-[95%] flex-row items-center justify-center gap-6 px-4 pl-8 md:gap-10 md:pl-4 xl:w-[214px] xl:items-stretch xl:justify-start xl:gap-8 xl:px-0">
          <div className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-full bg-black">
            <p className="text-center text-[30px] tracking-text text-yellow-500">
              10
            </p>
          </div>
          <div className="flex h-auto w-fit flex-col items-center justify-center">
            <ArrowRight className="animate-bounce-right size-[30px] text-purple-500" />
          </div>

          <div className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-full bg-black">
            <p className="text-center text-[30px] tracking-text text-yellow-500">
              0
            </p>
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full shrink-0 bg-white/10 xl:h-auto xl:w-[2px]"></div>
      <div className="flex h-full w-full flex-col items-center justify-between gap-6 xl:flex-row xl:items-end xl:gap-0">
        <div className="flex h-fit w-fit flex-col items-center justify-center gap-4 xl:items-start xl:gap-2">
          <h4 className="text-[25px] font-bold tracking-text text-white">
            THATS IT!
          </h4>
          <p className="text-center text-[12px] tracking-text text-white/50 xl:text-left">
            Start playing and improving{" "}
            <span className="inline xl:block">your English. Remember, </span>{" "}
            <span className="inline text-[#EC4899] xl:block">
              practice makes perfect.
            </span>
          </p>
        </div>
        <Button className="bg-green-500 px-3 py-1">
          <p className="text-sm font-semibold text-white">START PLAYING</p>
        </Button>
      </div>
    </div>
  );
}
