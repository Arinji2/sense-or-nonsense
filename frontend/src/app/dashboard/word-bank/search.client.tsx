"use client";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { cn } from "../../../../utils/cn";
export default function Search() {
  const [inputSearch, setInputSearch] = useState("");
  const [value] = useDebounce(inputSearch, 1000);

  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (value == "") {
      params.delete("search");
      router.push(`${pathname}?${params.toString()}`);
    } else {
      params.set("search", value);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [value, params, router, pathname]);

  return (
    <div className="flex h-fit w-full flex-row items-center justify-between gap-3 rounded-md bg-blue-500/10 p-2 shadow-md shadow-black">
      <input
        type="text"
        placeholder="Search"
        value={inputSearch}
        onChange={(e) => {
          setInputSearch(e.target.value);
        }}
        className="h-fit w-full rounded-md bg-transparent px-3 py-1 text-sm text-white outline-none md:text-base"
      />
      <Loader2
        className={cn(
          "size-6 animate-spin text-white opacity-100 transition-all duration-300 ease-in-out",
          {
            "opacity-0": value === inputSearch,
          },
        )}
      />
    </div>
  );
}
