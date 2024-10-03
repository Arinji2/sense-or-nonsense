"use client";

import { Button } from "@/components/button";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";
import { cn } from "../../../../utils/cn";

export function Filter({
  isLoading,
  startLoading,
  filterKey,
  label,
  width,
  color,
}: {
  isLoading: boolean;
  startLoading: React.TransitionStartFunction;
  filterKey: string;
  label: string;
  width: number;
  color: string;
}) {
  const [filter, setFiltering] = useState<0 | 1 | 2>(0);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();

  const filterValue = useMemo(() => {
    return searchParams.get(filterKey);
  }, [searchParams]);

  useEffect(() => {
    const filter = parseInt(filterValue ?? "0");
    if (isNaN(filter)) {
      setFiltering(0);
    } else if (filter === 1) {
      setFiltering(1);
    } else if (filter === 2) {
      setFiltering(2);
    } else setFiltering(0);
  }, [filterValue]);

  useEffect(() => {
    if (filter === 0) {
      params.delete(filterKey);
      window.history.pushState(null, "", `?${params.toString()}`);
    } else {
      params.set(filterKey, String(filter));
      window.history.pushState(null, "", `?${params.toString()}`);
    }

    startLoading(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [filter, filterKey]);

  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setFiltering(filter === 0 ? 1 : filter === 1 ? 2 : 0);
      }}
      style={
        {
          "--activeColor": `${color}40`,
          "--inactiveColor": `${color}20`,
          "--width": `${width}px`,
        } as React.CSSProperties
      }
      className={cn(
        "flex h-[40px] w-full scale-100 flex-row items-center justify-center gap-2 bg-[--activeColor] px-5 py-1 text-xs text-white enabled:hover:scale-100 md:text-sm xl:h-auto xl:w-[--width]",
        {
          "bg-[--inactiveColor]": filter === 0,
        },
      )}
    >
      <p
        className={cn(
          "absolute top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ease-in-out",
          filter !== 0 ? "left-3" : "left-1/2 -translate-x-1/2",
        )}
      >
        {label}
      </p>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 size-6 text-white opacity-0 transition-all duration-200 ease-in-out",
          {
            "opacity-100": filter !== 0,
            "rotate-180": filter === 2,
          },
        )}
      />
    </Button>
  );
}

export default function FiltersContainer({
  resultsFound,
}: {
  resultsFound: number;
}) {
  const [isFiltering, startFiltering] = useTransition();
  const results = useMemo(() => {
    return resultsFound;
  }, [resultsFound]);
  const isLogging = useRef(false);

  useEffect(() => {
    if (!isLogging.current) {
      isLogging.current = true;

      toast.success(`Found ${results} results`);

      setTimeout(() => {
        isLogging.current = false;
      }, 0);
    }
  }, [results]);

  return (
    <div className="flex h-fit w-full flex-col items-stretch justify-center gap-2 xl:h-auto xl:w-fit xl:flex-row">
      <Filter
        isLoading={isFiltering}
        startLoading={startFiltering}
        filterKey="type"
        label="Type"
        width={150}
        color="#06b6d4"
      />
      <Filter
        isLoading={isFiltering}
        startLoading={startFiltering}
        filterKey="level"
        label="Level"
        width={150}
        color="#a855f7"
      />
      <Filter
        isLoading={isFiltering}
        startLoading={startFiltering}
        filterKey="attempted"
        label="Attempted On"
        width={250}
        color="#84cc16"
      />
    </div>
  );
}
