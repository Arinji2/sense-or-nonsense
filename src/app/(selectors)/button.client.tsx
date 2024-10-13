"use client";

import { SetupGameAction } from "@/actions/game/setup";
import { GamesList } from "@/app/games";
import { Button } from "@/components/button";
import useLoading from "@/hooks/useLoading";
import QuickplayModal from "@/modals/quickplay";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import useAnimate from "../../../utils/useAnimate";

export default function PlayNowButton({
  gameData,
}: {
  gameData: (typeof GamesList)[0];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const animate = useAnimate(800);
  const [documentDefined, setDocumentDefined] = useState(false);
  const [showQuickPlayModal, setShowQuickPlayModal] = useState(false);
  const { isGlobalLoading, startLoading, startAsyncLoading } = useLoading();

  useEffect(() => {
    setDocumentDefined(true);
  }, []);
  return (
    <>
      {documentDefined &&
        showQuickPlayModal &&
        createPortal(
          <QuickplayModal Animate={animate} gameData={gameData} />,
          document.body,
        )}
      <Button
        disabled={isGlobalLoading || animate.queue}
        onClick={async () => {
          startLoading(() => {
            if (gameData.hasQuickPlaySupport) {
              animate.setQueue(true);
              setShowQuickPlayModal(true);

              return;
            }
          });
          startAsyncLoading(async () => {
            await toast.promise(SetupGameAction(gameData.id.toString()), {
              loading: "Setting up game...",
              success: "Game selected successfully!",
              error: "Failed to select game",
            });
          });

          startLoading(() => {
            const isRedirected = searchParams.get("redirected");
            if (isRedirected && isRedirected === "true") {
              router.replace("/pregame");
            }
            router.push("/difficulty");
          });
        }}
        className="w-full bg-green-500 text-xs text-white xl:w-fit xl:text-sm"
      >
        PLAY NOW
      </Button>
    </>
  );
}
