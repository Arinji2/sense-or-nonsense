"use client";

import OngoingGame from "@/modals/ongoing-game-modal";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GAME_ROUTES } from "../../constants/game-routes";
import useAnimate from "../../utils/useAnimate";

export default function GameInProgress() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const animate = useAnimate(800);
  useEffect(() => {
    if (!GAME_ROUTES.includes(pathname)) {
      setShowModal(true);
      animate.setQueue(true);
    } else {
      setShowModal(false);
      animate.setQueue(false);
    }
  }, [animate, pathname]);

  return (
    <>
      {showModal &&
        createPortal(<OngoingGame Animate={animate} />, document.body)}
    </>
  );
}
