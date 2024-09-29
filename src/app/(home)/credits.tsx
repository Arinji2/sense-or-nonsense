import { Button } from "@/components/button";

export default function Credits() {
  return (
    <div className="z-10 h-fit w-full bg-[#2C2828] xl:h-[100svh]">
      <div className="flex aspect-square h-auto w-full flex-col items-center justify-start gap-10 rounded-b-full bg-gradient-to-b from-[#EC4899]/25 to-[#1E1E1E]/25 px-4 py-10 md:pb-40 xl:aspect-auto xl:h-full xl:pb-32">
        <h3 className="text-[30px] font-bold tracking-subtitle text-white md:text-[50px] xl:text-[60px]">
          CREDITS
        </h3>
        <p className="max-w-[560px] text-center text-[12px] font-medium tracking-text text-white/70 md:text-[20px]">
          This site would not have been possible without the wonderful people
          who helped :D
        </p>
        <div className="mt-auto flex h-fit flex-col items-center justify-center gap-5">
          <p className="text-center text-[12px] font-bold tracking-subtitle text-purple-500 md:text-[25px] xl:text-[30px]">
            FROM FIGHTER LORE TO THE SOUNDTRACKS
          </p>
          <Button className="bg-purple-500 px-3 py-2">
            <p className="text-xs font-bold tracking-text text-white xl:text-sm">
              SHOW ME MORE!
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
