"use client";

import { InitGuest } from "@/actions/guest";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import LoginImage from "../../public/login.png";
import useAnimate from "../../utils/useAnimate";

export default function LoginModal({
  Animate,
  mode,
}: {
  Animate: ReturnType<typeof useAnimate>;
  mode: "single" | "multi";
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Animate.showComponent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", closeOpenMenus);
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

  return (
    Animate.actualState && (
      <div
        className={`${
          Animate.showComponent ? "opacity-100 " : " opacity-0 "
        } w-full h-[100svh]  transition-all duration-700 ease-in-out fixed top-0  z-[1500] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
      >
        <div
          ref={containerRef}
          className="w-[90%] max-w-[1280px] xl:w-[80%] md:h-[80%] h-[80%] flex flex-col group xl:flex-row items-center justify-start gap-5 xl:h-[400px] bg-custom-black overflow-hidden rounded-md "
        >
          <div className="w-full xl:w-[30%] xl:h-full h-[40%] relative overflow-hidden">
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute xl:hidden block p-2 bg-black/30 z-20 rounded-sm top-8 right-8"
            >
              <X className="size-5 text-white" />
            </button>
            <Image
              fill
              src={LoginImage}
              alt="Login Image"
              className="object-cover w-full h-full brightness-50 group-hover:brightness-75 group-hover:scale-110 transition-all duration-500 ease-in-out"
              sizes="(min-width: 1280px) 500px, 80%"
              priority
            />
          </div>
          <div className="w-full relative xl:w-[70%] xl:h-full h-fit flex flex-col items-center justify-center  xl:py-20  gap-10  p-6 ">
            <button
              aria-label="Close Modal"
              onClick={() => {
                Animate.setQueue(false);
              }}
              className="absolute xl:block hidden top-8 right-8"
            >
              <X className="size-10 text-white" />
            </button>
            <h4 className="font-bold text-[20px] md:text-[35px] text-center tracking-subtitle  text-green-500">
              {" "}
              CONTINUE WITH SENSE OR NONSENSE
            </h4>
            <div className="w-fit h-fit flex flex-wrap flex-row items-center justify-center gap-5 xl:gap-10 ">
              <button
                onClick={async () => {
                  router.push("/login");
                }}
                className="xl:w-fit w-full shrink-0 h-fit text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-purple-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
              >
                LOGIN TO ACCOUNT
              </button>
              <button
                onClick={async () => {
                  await InitGuest();
                  router.push(`/${mode}`);
                }}
                className="xl:w-fit w-full shrink-0 h-fit text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-blue-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
              >
                PLAY AS GUEST
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
