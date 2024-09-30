import { Suspense } from "react";
import GamesGraph, { FallbackGamesGraph } from "./games-graph";

export default async function Page() {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-2xl font-bold tracking-title text-white md:text-4xl">
          DASHBOARD
        </h1>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="grid h-full w-full grid-cols-1 gap-8 xl:grid-cols-2 xl:grid-rows-2"
        >
          <Suspense fallback={<FallbackGamesGraph />}>
            <GamesGraph />
          </Suspense>
          <div className="row-span-2 h-full w-full border-2 border-yellow-500"></div>

          <div className="h-full w-full border-2 border-red-400"></div>
        </div>
      </div>
    </div>
  );
}
