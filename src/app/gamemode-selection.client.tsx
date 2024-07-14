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
          document.body
        )}
      <button
        onClick={() => {
          if (isLoggedin) router.push(`/${tag}`);
          animate.setQueue(true);
        }}
        className="w-full h-[500px] outline-none xl:h-full group xl:max-h-[500px] flex flex-col max-w-[610px] items-center justify-start rounded-lg relative overflow-hidden"
      >
        <Image
          src={image}
          alt={`${title}`}
          className="w-full z-0 h-full group-hover:scale-125 transition-transform ease-in-out duration-500 absolute top-0 left-0 object-cover"
        ></Image>
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-[#2C2828CC] opacity-80"></div>
        <div className="w-full h-full z-20 flex flex-col items-center justify-start gap-5 pt-8 px-2 md:px-8">
          <h2
            className={cn({
              "text-blue-500 text-center text-[30px] md:text-[40px] xl:text-[60px] font-medium tracking-subtitle":
                true,
              "text-purple-500": secondary,
            })}
          >
            {title}
          </h2>
          <p className=" tracking-text text-center text-[20px] text-white">
            {description}
          </p>
        </div>
        <div className="mt-auto bg-[#2C2828A8] z-20 bg-opacity-70 w-full h-fit py-8 flex flex-col items-center justify-center gap-6">
          <h3 className="text-green-500 text-[20px] tracking-text">
            Available Game Modes
          </h3>
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-fit h-fit flex flex-row items-center justify-center gap-2"
            >
              <p className="text-[20px] text-white tracking-text">
                {index + 1}.
              </p>
              <p className="text-[20px] text-white tracking-text">{feature}</p>
            </div>
          ))}
        </div>
      </button>
    </>
  );
}
