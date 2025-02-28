"use client";

import { Button } from "@/components/button";
import LoginModal from "@/modals/login-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAnimate from "../../../utils/useAnimate";

export default function GamemodeSelector({
  tag,
  isLoggedIn,
  className,
  children,
}: {
  tag: "single" | "multi";
  isLoggedIn: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [documentDefined, setDocumentDefined] = useState(false);
  useEffect(() => {
    setDocumentDefined(true);
  }, []);
  const animate = useAnimate(800);
  const router = useRouter();
  return (
    <>
      {documentDefined &&
        !isLoggedIn &&
        createPortal(
          <LoginModal Animate={animate} mode={tag} />,
          document.body,
        )}
      <Button
        className={className}
        disabled={animate.queue}
        onClick={() => {
          if (isLoggedIn) router.push(`/${tag}`);
          else animate.setQueue(true);
        }}
      >
        {children}
      </Button>
    </>
  );
}
