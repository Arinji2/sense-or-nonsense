"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { EncryptGameDataAction } from "../../../utils/game-data";
import { DifficultyList } from "./difficully";

export default function Selector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      {DifficultyList.map((difficulty) => (
        <button
          onClick={async () => {
            await EncryptGameDataAction({
              key: "game",
              deleteKey: true,
              value: "",
            });
            await EncryptGameDataAction({
              key: "difficulty",
              value: difficulty.level.toString(),
            });
            toast.success("Difficulty selected successfully!");
            const isRedirected = searchParams.get("redirected");
            if (isRedirected && isRedirected === "true") {
              router.replace("/pregame");
            } else router.push("/fighters");
          }}
          key={difficulty.id}
          className="h-[300px] group xl:h-[450px] w-full xl:w-[300px] bg-transparent relative overflow-hidden rounded-md flex gap-5 flex-col items-center  justify-center px-3"
        >
          <Image
            src={difficulty.image}
            alt={`${difficulty.name} difficulty`}
            className="object-cover object-top xl:object-center group-hover:grayscale-[25%] group-hover:scale-110 grayscale-[100%] transition-all ease-in-out duration-500"
            fill
            sizes="(min-width: 1280px) 450px, 90%"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-[#2C2828] bg-opacity-70 z-10"></div>
          <h2
            style={{ "--color": difficulty.color } as React.CSSProperties}
            className="font-medium text-[50px] text-[--color] z-20"
          >
            {difficulty.name.toUpperCase()}
          </h2>
        </button>
      ))}
    </>
  );
}
