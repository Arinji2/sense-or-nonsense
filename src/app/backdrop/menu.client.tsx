"use client";

import { AddBackdropAction } from "@/actions/game/backdrop";
import { ChevronUpCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../utils/cn";
import { NameFormat } from "../../../utils/formatting";
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
        "fixed bottom-0 left-0 z-50 flex h-[15svh] w-full translate-y-[calc(100%-50px)] flex-col items-center justify-start gap-5 bg-black py-4 transition-all duration-500 ease-in-out xl:h-[20svh]":
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
            "rotate-0 text-white transition-all duration-500 ease-in-out": true,
            "rotate-180": isActive,
            "animate-bounce": backdrop.verified && !isActive,
          })}
        />
      </button>
      <div className="mt-auto flex h-fit w-full flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
        <button
          disabled={!backdrop.verified}
          onClick={() => {
            params.delete("selected");
            window.history.pushState(null, "", `?${params.toString()}`);

            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });

            setTimeout(() => {
              toast.success("Backdrop Reset");
            }, 500);
          }}
          className="flex h-fit w-fit shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-red-500 p-2 px-6 text-[10px] text-white transition-transform duration-200 ease-in-out will-change-transform enabled:hover:scale-100 disabled:bg-gray-500 xl:text-[15px]"
        >
          RESET
        </button>
        <button
          disabled={!backdrop.verified}
          onClick={async () => {
            toast.promise(AddBackdropAction(backdrop.id), {
              loading: "Selecting Backdrop",
              success: "Backdrop Selected",
              error: "Failed to select backdrop",
            });
            const isRedirected = searchParams.get("redirected");
            if (isRedirected && isRedirected === "true") {
              router.replace("/pregame");
            } else router.push("/pregame");
          }}
          className="flex h-fit w-fit shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-green-500 p-2 px-6 text-[10px] text-white transition-transform duration-200 ease-in-out will-change-transform enabled:hover:scale-100 disabled:bg-gray-500 xl:text-[15px]"
        >
          LETS GO!
        </button>
        <button
          disabled={randomSelected}
          onClick={async () => {
            const selectedBackdrop =
              BackdropsList[Math.floor(Math.random() * BackdropsList.length)];
            setRandomSelected(true);
            params.set("selected", selectedBackdrop.id.toString());
            window.history.pushState(null, "", `?${params.toString()}`);

            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
            setTimeout(() => {
              toast.success(
                `Now Viewing ${NameFormat(selectedBackdrop.name)} Backdrop`,
              );
            }, 500);
            setRandomSelected(false);
          }}
          className="flex h-fit w-fit shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-purple-500 p-2 px-6 text-[10px] text-white transition-transform duration-200 ease-in-out will-change-transform enabled:hover:scale-100 disabled:bg-gray-500 xl:text-[15px]"
        >
          RANDOM
        </button>
      </div>
    </div>
  );
}
