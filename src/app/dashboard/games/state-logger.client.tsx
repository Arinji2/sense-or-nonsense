"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { NameFormat } from "../../../../utils/formatting";

export default function StateLogger() {
  const searchParams = useSearchParams();
  const state = useMemo(() => {
    return searchParams.get("state");
  }, [searchParams]);
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const isLogging = useRef(false);

  useEffect(() => {
    if (!isLogging.current && state) {
      isLogging.current = true;

      toast.error(
        `Error: ${NameFormat(state.replaceAll("_", " "))}. Please try again later.`,
      );
      setTimeout(() => {
        params.delete("state");
        window.history.pushState(null, "", `?${params.toString()}`);
        router.replace(`${pathname}?${params.toString()}`);
      }, 500);
    }
  }, [state]);

  return <></>;
}
