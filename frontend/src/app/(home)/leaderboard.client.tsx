"use client";

import LeaderboardModal from "@/modals/leaderboard";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAnimate from "../../../utils/useAnimate";

export default function Modal({ show }: { show: boolean }) {
  const [documentDefined, setDocumentDefined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const animate = useAnimate(800);

  useEffect(() => {
    setDocumentDefined(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const shown = localStorage.getItem("showLeaderboard");
    if (shown !== "true") {
      setShowModal(true);
      animate.setQueue(true);
    }
  }, [show, animate]);

  useEffect(() => {
    console.log(showModal);
  }, [showModal]);

  return (
    <>
      {documentDefined &&
        showModal &&
        createPortal(<LeaderboardModal Animate={animate} />, document.body)}
    </>
  );
}
