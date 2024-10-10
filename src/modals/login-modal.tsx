"use client";

import { InitGuest } from "@/actions/guest";
import { Button } from "@/components/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import LoginImage from "../../public/login.png";
import useAnimate from "../../utils/useAnimate";
import AuthModal from "./auth-modal";

export default function LoginModal({
  Animate,
  mode,
}: {
  Animate: ReturnType<typeof useAnimate>;
  mode: "single" | "multi";
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [documentReady, setDocumentReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setDocumentReady(true);
  }, []);

  const closeOpenMenus = useCallback(
    (e: any) => {
      if (
        containerRef.current &&
        Animate.showComponent &&
        !containerRef.current.contains(e.target)
      ) {
        Animate.setQueue(false);
      }
    },
    [Animate],
  );

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    function escHandler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeOpenMenus({});
      }
    }

    document.addEventListener("mousedown", closeOpenMenus);
    document.addEventListener("keydown", escHandler);

    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "unset";
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Animate.showComponent]);

  const router = useRouter();

  const loginAnimate = useAnimate(800);

  return (
    Animate.actualState && (
      <>
        {documentReady &&
          showLogin &&
          createPortal(<AuthModal Animate={loginAnimate} />, document.body)}
        <div
          className={`${
            Animate.showComponent ? "opacity-100" : "opacity-0"
          } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
        >
          <div
            ref={containerRef}
            className="group flex h-[80%] w-[90%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-custom-black md:h-[80%] xl:h-[400px] xl:w-[80%] xl:flex-row"
          >
            <div className="relative h-[40%] w-full overflow-hidden xl:h-full xl:w-[30%]">
              <button
                aria-label="Close Modal"
                onClick={() => {
                  Animate.setQueue(false);
                }}
                className="absolute right-8 top-8 z-20 block rounded-sm bg-black/30 p-2 xl:hidden"
              >
                <X className="size-5 text-white" />
              </button>
              <Image
                fill
                src={LoginImage}
                alt="Login Image"
                className="h-full w-full object-cover brightness-50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
                sizes="(min-width: 1280px) 500px, 80%"
                priority
              />
            </div>
            <div className="relative flex h-fit w-full flex-col items-center justify-center gap-10 p-6 xl:h-full xl:w-[70%] xl:py-20">
              <button
                aria-label="Close Modal"
                onClick={() => {
                  Animate.setQueue(false);
                }}
                className="absolute right-8 top-8 hidden xl:block"
              >
                <X className="size-10 text-white" />
              </button>
              <h4 className="tracking-subtitle text-md text-center font-bold text-green-500 md:text-xl xl:text-2xl">
                {" "}
                CONTINUE WITH SENSE OR NONSENSE
              </h4>
              <div className="flex h-fit w-fit flex-row flex-wrap items-center justify-center gap-5 xl:gap-10">
                <Button
                  onClick={async () => {
                    setShowLogin(true);
                    loginAnimate.setQueue(true);
                  }}
                  className="w-full bg-purple-500 text-xs text-white xl:w-fit xl:text-sm"
                >
                  LOGIN TO ACCOUNT
                </Button>
                <Button
                  onClick={async () => {
                    await toast.promise(InitGuest(), {
                      loading: "Loading Guest Mode...",
                      success: "Guest Mode enabled",
                      error: "Error enabling Guest Mode",
                    });

                    router.push(`/${mode}`);
                  }}
                  className="w-full bg-blue-500 text-xs text-white xl:w-fit xl:text-sm"
                >
                  PLAY AS GUEST
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
