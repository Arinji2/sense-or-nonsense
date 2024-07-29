"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../../utils/cn";

export function RoundSummaryHeaders({ word }: { word: string }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const keyableWord = useMemo(
    () => word.toLowerCase().replace(" ", ""),
    [word],
  );

  const isEnabled = useMemo(() => {
    if (params.get(keyableWord) === "true") return true;
    return false;
  }, [params, keyableWord]);
  const [_, startTransition] = useTransition();

  return (
    <th
      className={cn({
        "bg-black/0 px-1 py-1 font-medium text-blue-500 transition-colors duration-300 ease-in-out hover:bg-black/20 xl:text-lg":
          true,
      })}
    >
      <button
        onClick={() => {
          const allParams = searchParams.keys();
          const allParamsSet = new Set(allParams);

          allParamsSet.delete("player");

          allParamsSet.forEach((param) => {
            params.delete(param);
          });
          if (isEnabled) {
            params.delete(keyableWord);
          } else {
            params.set(keyableWord, "true");
          }
          startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
            if (isEnabled) {
              toast.success(`Remove sorting by ${word}`);
            } else {
              toast.success(`Sorting by ${word}`);
            }
          });
        }}
        className="inline-flex items-center space-x-1"
      >
        <p className="whitespace-nowrap text-xs xl:text-base">
          {word.toUpperCase()}
        </p>

        <ChevronDown
          className={cn({
            "size-3 text-white xl:size-4": true,
            "rotate-180": isEnabled,
          })}
        />
      </button>
    </th>
  );
}
