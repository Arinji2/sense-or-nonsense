import { Button } from "@/components/button";
import Link from "next/link";

export default function Credits() {
  return (
    <div className="z-10 h-fit w-full bg-[#2C2828] xl:h-[100svh]">
      <div className="flex aspect-square h-auto w-full flex-col items-center justify-start gap-10 rounded-b-full bg-gradient-to-b from-[#EC4899]/25 to-[#1E1E1E]/25 px-4 py-10 md:pb-40 xl:aspect-auto xl:h-full xl:pb-32">
        <h3 className="text-2xl font-bold tracking-title text-white md:text-5xl xl:text-6xl">
          CREDITS
        </h3>
        <p className="max-w-[700px] text-center text-xss text-white/70 md:text-lg">
          This site would not have been possible without the wonderful people
          who helped :D
        </p>
        <div className="mt-auto flex h-fit flex-col items-center justify-center gap-5">
          <p className="text-center text-xs font-bold tracking-title text-purple-500 md:text-lg xl:text-xl">
            FROM FIGHTER LORE TO THE SOUNDTRACKS
          </p>
          <Link href="/credits" className="h-fit w-fit">
            <Button className="bg-purple-500 px-3 py-2">
              <p className="whitespace-nowrap text-xs font-bold text-white">
                SHOW ME MORE!
              </p>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
