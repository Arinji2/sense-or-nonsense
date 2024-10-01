"use client";

import { Button } from "@/components/button";
import AuthModal from "@/modals/auth-modal";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../../utils/cn";
import useAnimate from "../../../../utils/useAnimate";

export default function LinkOauth({
  isGuest,
  existingOauth,
}: {
  isGuest: boolean;
  existingOauth: string[];
}) {
  const [documentDefined, setDocumentDefined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const animate = useAnimate(800);

  useEffect(() => {
    setDocumentDefined(true);
  }, []);
  return (
    <>
      {documentDefined &&
        showModal &&
        createPortal(
          <AuthModal
            Animate={animate}
            disabledProvider={existingOauth}
            refresh
          />,
          document.body,
        )}
      <div
        className={cn(
          "flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-yellow-500/20 p-4 md:h-[200px] md:flex-row",
          {
            "cursor-not-allowed opacity-20": isGuest,
          },
        )}
      >
        <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
          <h3 className="text-center text-lg font-bold text-white md:text-left md:text-xl xl:text-2xl">
            LOGIN WITH OTHER PROVIDER
          </h3>
        </div>
        <div className="h-[80%] w-[2px] bg-white/20"></div>
        <div className="flex h-fit w-full flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
          <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
            <p className="text-center text-xss tracking-wide text-white md:text-left">
              Available Providers {`(email must be the same)`}
            </p>

            <div className="flex h-fit w-full flex-col items-center justify-center md:w-fit">
              <ul className="flex h-fit w-fit flex-col items-start justify-start gap-2 text-white/50">
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Google
                </li>
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Discord
                </li>
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Github
                </li>
              </ul>
            </div>
          </div>
          <Button
            disabled={isGuest}
            onClick={() => {
              setShowModal(true);
              animate.setQueue(true);
            }}
            className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto md:w-fit xl:w-[120px] xl:py-2"
          >
            <p className="text-xs font-bold text-white md:text-xs">LOGIN</p>
          </Button>
        </div>
      </div>
    </>
  );
}
