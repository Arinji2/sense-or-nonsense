import WidthWrapper from "@/wrappers/width-wrapper";
import MultiPlayerImage from "../../public/multi.png";
import SinglePlayerImage from "../../public/single.png";
import { GetUserMode } from "../../utils/getMode";
import GamemodeSelector from "./gamemode-selection.client";

export default async function Home() {
  const { userID } = await GetUserMode();

  return (
    <WidthWrapper>
      <div className="gap-10 xl:h-screen-svh  py-6  md:gap-4 flex flex-col items-center justify-center w-full h-full">
        <h1 className="font-bold tracking-title  text-white md:text-[40px] text-[30px] text-center xl:text-[80px]">
          <span className="text-green-500 md:inline block">SENSE</span> OR{" "}
          <span className="text-red-500">NONSENSE</span>
        </h1>
        <p className="text-white tracking-text text-[20px] text-center xl:text-[30px]">
          "Mandela Effect on basic English Words amplified"
        </p>
        <div className="mt-auto w-full h-full flex flex-row items-end justify-center flex-wrap xl:flex-nowrap gap-10">
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
          ></GamemodeSelector>
        </div>
      </div>
    </WidthWrapper>
  );
}
