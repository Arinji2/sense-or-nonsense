"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AddDifficultyAction } from "@/actions/game/difficulty";
import { DifficultyList } from "./difficully";

export default function Selector({ gameID }: { gameID: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      {DifficultyList.map((difficulty) => (
        <button
          onClick={async () => {
            const resolve = toast.promise(
              AddDifficultyAction(gameID, difficulty.level),
              {
                loading: "Setting difficulty...",
                success: "Difficulty selected successfully!",
                error: "Failed to select difficulty",
              },
            );

            await resolve;

            const isRedirected = searchParams.get("redirected");
            if (isRedirected && isRedirected === "true") {
              router.replace("/pregame");
            } else router.push("/fighters");
          }}
          key={difficulty.id}
          className="group relative flex h-[300px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-md bg-transparent px-3 md:h-[450px] md:w-[300px]"
        >
          <Image
            src={difficulty.image}
            alt={`${difficulty.name} difficulty`}
            className="object-cover object-top grayscale-[45%] transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-[25%] xl:object-center xl:grayscale-[100%]"
            fill
            sizes="(min-width: 1280px) 450px, 90%"
          />
          <div className="absolute left-0 top-0 z-10 h-full w-full bg-[#2C2828] bg-opacity-90 xl:bg-opacity-70"></div>
          <h2
            style={{ "--color": difficulty.color } as React.CSSProperties}
            className="z-20 text-2xl font-bold text-[--color] md:text-2xl xl:text-3xl"
          >
            {difficulty.name.toUpperCase()}
          </h2>
        </button>
      ))}
    </>
  );
}
