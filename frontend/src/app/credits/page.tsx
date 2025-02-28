import { Button } from "@/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-start gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
          CREDITS
        </h1>
        <div className="flex h-fit w-full flex-col items-center justify-start gap-8">
          <p className="text-center text-sm text-white xl:text-lg">
            A list of all the wonderful people who helped make this game
            possible
          </p>
          <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-3 rounded-md bg-purple-500/70 p-4 shadow-md shadow-black">
            <h2 className="text-center text-sm font-bold tracking-title text-white md:text-xl xl:text-2xl">
              Ahaana Ravishankor
            </h2>
            <p className="text-sm text-white/70 md:text-base xl:text-lg">
              Fighter Lore
            </p>
          </div>
          <Link
            href={"https://www.youtube.com/watch?v=Z3Pw56IN0QM"}
            className="flex w-full max-w-[500px] flex-col items-center justify-center gap-3 rounded-md bg-blue-500/70 p-4 shadow-md shadow-black"
          >
            <h2 className="text-center text-sm font-bold tracking-title text-white md:text-xl xl:text-2xl">
              Heatley Bros
            </h2>
            <p className="text-sm text-white/70 md:text-base xl:text-lg">
              Game Soundtrack 1
            </p>
          </Link>
          <Link
            href={"https://www.youtube.com/watch?v=tIz8Poxl7tM"}
            className="flex w-full max-w-[500px] flex-col items-center justify-center gap-3 rounded-md bg-teal-500/70 p-4 shadow-md shadow-black"
          >
            <h2 className="text-center text-sm font-bold tracking-title text-white md:text-xl xl:text-2xl">
              Heatley Bros
            </h2>
            <p className="text-sm text-white/70 md:text-base xl:text-lg">
              Game Soundtrack 2
            </p>
          </Link>
        </div>
        <Link href="/" className="h-fit w-fit">
          <Button className="bg-pink-500 px-3 py-2">
            <p className="whitespace-nowrap text-xs font-bold text-white">
              BACK TO HOME
            </p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
