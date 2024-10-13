"use client";

import { SetupGameAction } from "@/actions/game/setup";
import { GamesList } from "@/app/games";
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
  const [loading, setLoading] = useState(false);

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
      <button
        disabled={loading || animate.queue}
        onClick={async () => {
          setLoading(true);
          if (gameData.hasQuickPlaySupport) {
            animate.setQueue(true);
            setShowQuickPlayModal(true);
            setLoading(false);
            return;
          }
          await toast.promise(SetupGameAction(gameData.id.toString()), {
            loading: "Setting up game...",
            success: "Game selected successfully!",
            error: "Failed to select game",
          });

          const isRedirected = searchParams.get("redirected");
          if (isRedirected && isRedirected === "true") {
            setLoading(false);
            router.replace("/pregame");
          }

          router.push("/difficulty");
          setLoading(false);
        }}
        className="w-full shrink-0 rounded-sm bg-green-500 p-2 px-4 text-xss font-bold text-white transition-all duration-200 ease-in-out hover:bg-green-600 md:text-xs xl:w-fit xl:text-sm xl:font-normal"
      >
        PLAY NOW
      </button>
    </>
  );
}
