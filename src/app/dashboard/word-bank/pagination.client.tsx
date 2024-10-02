"use client";

import { Button } from "@/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  pageNumber,
  totalPages,
}: {
  pageNumber: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex h-fit w-full flex-row items-center justify-center gap-4">
      <Button
        onClick={() => {
          params.set("page", String(pageNumber - 1));
          router.push(`${pathname}?${params.toString()}`);
        }}
        disabled={pageNumber === 1}
        className="w-fit bg-green-500/40 px-3 py-1 text-xs text-white"
      >
        <ChevronLeft className="size-6 text-white" />
      </Button>
      <p className="text-xs text-white">
        {pageNumber} of {totalPages}
      </p>
      <Button
        onClick={() => {
          params.set("page", String(pageNumber + 1));
          router.push(`${pathname}?${params.toString()}`);
        }}
        disabled={pageNumber === totalPages}
        className="w-fit bg-green-500/40 px-3 py-1 text-xs text-white"
      >
        <ChevronRight className="size-6 text-white" />
      </Button>
    </div>
  );
}
