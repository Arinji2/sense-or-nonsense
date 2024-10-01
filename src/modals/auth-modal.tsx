"use client";

import { AddAccountCookieAction } from "@/actions/account";
import { Button } from "@/components/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pocketbase from "pocketbase";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import LoginImage from "../../public/auth.webp";
import useAnimate from "../../utils/useAnimate";

export default function AuthModal({
  Animate,
  disabledProvider,
  state,
  refresh,
}: {
  Animate: ReturnType<typeof useAnimate>;
  disabledProvider?: string[];
  state?: Record<string, string>;
  refresh?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", closeOpenMenus);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Animate.showComponent]);

  const closeOpenMenus = (e: any) => {
    if (
      containerRef.current &&
      Animate.showComponent &&
      !containerRef.current.contains(e.target)
    ) {
      Animate.setQueue(false);
    }
  };

  const router = useRouter();
  const pb = new Pocketbase("https://db-word.arinji.com");

  const oauthHandler = async (provider: string) => {
    await toast.promise(
      (async () => {
        const authData = await pb.collection("users").authWithOAuth2({
          provider: provider,
        });

        await AddAccountCookieAction(authData.token);
        refresh && router.refresh();
      })(),
      {
        loading: `Authenticating with ${provider}...`,
        success: "Authenticated successfully!",
        error: "Authentication failed!",
      },
    );

    if (state) {
      const key = state.key;
      const value = state.value;
      history.pushState(null, "", `?${key}=${value}`);
    }

    Animate.setQueue(false);
  };

  // Filter enabled providers
  const enabledProviders = ["google", "discord", "github"].filter(
    (provider) => !disabledProvider?.includes(provider),
  );

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100" : "opacity-0"
        } fixed top-0 z-[1500] flex h-[100svh] w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-700 ease-in-out`}
      >
        <div
          ref={containerRef}
          className="group flex h-[55%] w-[90%] max-w-[1280px] flex-col items-center justify-start gap-5 overflow-hidden rounded-md bg-custom-black md:h-[80%] xl:h-[400px] xl:w-[80%] xl:flex-row"
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
            <h4 className="text-center text-base font-bold text-green-500 md:text-lg xl:text-2xl">
              CONTINUE WITH SENSE OR NONSENSE
            </h4>
            <div
              className={`grid h-fit w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 xl:w-[70%] xl:gap-10`}
            >
              {enabledProviders.map((provider) => (
                <Button
                  key={provider}
                  onClick={() => oauthHandler(provider)}
                  className={`flex h-fit w-full flex-row items-center justify-center gap-5 bg-white/10 text-xs text-white md:gap-3 md:text-xs xl:p-4 ${
                    enabledProviders.length === 1 ? "xl:col-span-2" : ""
                  }`}
                >
                  AUTH WITH{" "}
                  <Image
                    src={`/brands/${provider}.svg`}
                    alt={`${provider} logo`}
                    width={20}
                    height={20}
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
