"use client";

import { ChevronUpCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../utils/cn";
import { EncryptGameDataAction } from "../../../utils/game-data";
import { BackdropSelected } from "../../../validations/generic/types";
import { BackdropsList } from "./backdrops";

export default function Menu({ backdrop }: { backdrop: BackdropSelected }) {
  const [isActive, setIsActive] = useState(false);
  const [randomSelected, setRandomSelected] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOpenMenus = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsActive(false);
      }
    });

    window.addEventListener("mousedown", closeOpenMenus);
    return () => {
      window.removeEventListener("mousedown", closeOpenMenus);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn({
        "w-full h-[15svh] xl:h-[20svh] py-4 translate-y-[calc(100%-50px)] gap-5 bg-black fixed bottom-0 left-0 z-50 flex flex-col items-center justify-start  transition-all ease-in-out duration-500":
          true,
        "translate-y-0": isActive,
      })}
    >
      <button
        onClick={() => {
          setIsActive((prev) => !prev);
        }}
        className="px-3 outline-none"
      >
        <ChevronUpCircle
          size={24}
          strokeWidth={3}
          className={cn({
            "text-white transition-all ease-in-out duration-500 rotate-0": true,
            "rotate-180": isActive,
            "animate-bounce": backdrop.verified && !isActive,
          })}
        />
      </button>
      <div className="w-full h-fit flex mt-auto flex-row items-center gap-5 xl:gap-10 flex-wrap justify-center">
        <button
          disabled={!backdrop.verified}
          onClick={() => {
            params.delete("selected");
            window.history.pushState(null, "", `?${params.toString()}`);

            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
          }}
          className="w-fit px-6 disabled:bg-gray-500  shrink-0 h-fit will-change-transform text-[10px] xl:text-[15px] enabled:hover:scale-100  scale-105 transition-transform ease-in-out duration-200  bg-red-500 text-white rounded-md p-2 flex flex-col items-center justify-center"
        >
          RESET
        </button>
        <button
          disabled={!backdrop.verified}
          onClick={async () => {
            await EncryptGameDataAction({
              key: "backdrop",
              value: backdrop.id.toString(),
            });

            toast.success("Backdrop selected successfully!");
            const isRedirected = searchParams.get("redirected");
            if (isRedirected && isRedirected === "true") {
              router.replace("/pregame");
            } else router.push("/pregame");
          }}
          className="w-fit px-6 disabled:bg-gray-500  shrink-0 h-fit will-change-transform text-[10px] xl:text-[15px] enabled:hover:scale-100  scale-105 transition-transform ease-in-out duration-200  bg-green-500 text-white rounded-md p-2 flex flex-col items-center justify-center"
        >
          LETS GO!
        </button>
        <button
          disabled={randomSelected}
          onClick={async () => {
            setRandomSelected(true);
            params.set(
              "selected",
              Math.floor(Math.random() * BackdropsList.length).toString()
            );
            window.history.pushState(null, "", `?${params.toString()}`);

            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
            setRandomSelected(false);
          }}
          className="w-fit px-6 disabled:bg-gray-500  shrink-0 h-fit will-change-transform text-[10px] xl:text-[15px] enabled:hover:scale-100  scale-105 transition-transform ease-in-out duration-200  bg-purple-500 text-white rounded-md p-2 flex flex-col items-center justify-center"
        >
          RANDOM
        </button>
      </div>
    </div>
  );
}
