"use client";
import LoginModal from "@/modals/login-modal";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import useAnimate from "../../utils/useAnimate";

export default function GamemodeSelector({
  title,
  features,
  image,
  description,
  secondary,
  tag,
  isLoggedin,
}: {
  title: string;
  features: string[];
  image: StaticImageData;
  description: string;
  secondary?: boolean;
  tag: "single" | "multi";
  isLoggedin: boolean;
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
        !isLoggedin &&
        createPortal(
          <LoginModal Animate={animate} mode={tag} />,
          document.body,
        )}
      <button
        onClick={() => {
          if (isLoggedin) router.push(`/${tag}`);
          animate.setQueue(true);
        }}
        className="group relative flex h-[500px] w-full max-w-[610px] flex-col items-center justify-start overflow-hidden rounded-lg outline-none xl:h-full xl:max-h-[500px]"
      >
        <Image
          src={image}
          alt={`${title}`}
          className="absolute left-0 top-0 z-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
        ></Image>
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-[#2C2828CC] opacity-80"></div>
        <div className="z-20 flex h-full w-full flex-col items-center justify-start gap-5 px-2 pt-8 md:px-8">
          <h2
            className={cn({
              "text-center text-[30px] font-medium tracking-subtitle text-blue-500 md:text-[40px] xl:text-[60px]":
                true,
              "text-purple-500": secondary,
            })}
          >
            {title}
          </h2>
          <p className="text-center text-[20px] tracking-text text-white">
            {description}
          </p>
        </div>
        <div className="z-20 mt-auto flex h-fit w-full flex-col items-center justify-center gap-6 bg-[#2C2828A8] bg-opacity-70 py-8">
          <h3 className="text-[20px] tracking-text text-green-500">
            Available Game Modes
          </h3>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex h-fit w-fit flex-row items-center justify-center gap-2"
            >
              <p className="text-[20px] tracking-text text-white">
                {index + 1}.
              </p>
              <p className="text-[20px] tracking-text text-white">{feature}</p>
            </div>
          ))}
        </div>
      </button>
    </>
  );
}
