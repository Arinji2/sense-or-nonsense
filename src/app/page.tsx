import WidthWrapper from "@/wrappers/width-wrapper";
import MultiPlayerImage from "../../public/multi.png";
import SinglePlayerImage from "../../public/single.png";
import { GetUserMode } from "../../utils/getMode";
import GamemodeSelector from "./gamemode-selection.client";

export default async function Home() {
  const { userID } = await GetUserMode();

  return (
    <WidthWrapper>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 py-6 md:gap-4 xl:h-screen-svh">
        <h1 className="text-center text-[30px] font-bold tracking-title text-white md:text-[40px] xl:text-[80px]">
          <span className="block text-green-500 md:inline">SENSE</span> OR{" "}
          <span className="text-red-500">NONSENSE</span>
        </h1>
        <p className="text-center text-[20px] tracking-text text-white xl:text-[30px]">
          "Mandela Effect on basic English Words amplified"
        </p>
        <div className="mt-auto flex h-full w-full flex-row flex-wrap items-end justify-center gap-10 xl:flex-nowrap">
          <GamemodeSelector
            title="SINGLE PLAYER"
            description="Try and beat your own high scores"
            features={["High Score Battle", "Player VS CPU"]}
            image={SinglePlayerImage}
            tag="single"
            isLoggedin={userID !== null}
          ></GamemodeSelector>
          <GamemodeSelector
            title="MULTI PLAYER"
            description="Battle against your friends"
            features={["Co Op Battles", "Online Battles"]}
            image={MultiPlayerImage}
            secondary
            tag="multi"
            isLoggedin={userID !== null}
            comingSoon
          ></GamemodeSelector>
        </div>
      </div>
    </WidthWrapper>
  );
}
