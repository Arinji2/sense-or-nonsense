"use client";

import { useCallback, useState, useTransition } from "react";

export default function useLoading() {
  const [isAsyncLoading, setAsyncLoading] = useState(false);
  const [isSyncLoading, startLoading] = useTransition();

  const startAsyncLoading = useCallback(
    async (callback: () => Promise<void>) => {
      setAsyncLoading(true);
      await callback();
      setAsyncLoading(false);
    },
    [],
  );

  const isGlobalLoading = isAsyncLoading || isSyncLoading;

  return {
    isAsyncLoading,
    isSyncLoading,
    isGlobalLoading,
    startLoading,
    startAsyncLoading,
  };
}
