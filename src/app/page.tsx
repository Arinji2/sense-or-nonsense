import WidthWrapper from "@/wrappers/width-wrapper";
import MultiPlayerImage from "../../public/multi.png";
import SinglePlayerImage from "../../public/single.png";
import GamemodeSelector from "./gamemode-selection.client";

export default function Home() {
  return (
    <main className="w-full h-fit xl:h-screen-svh bg-gradient-bg  py-6 ">
      <WidthWrapper>
        <div className="gap-10 md:gap-4 flex flex-col items-center justify-center w-full h-full">
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
            ></GamemodeSelector>
            <GamemodeSelector
              title="MULTI PLAYER"
              description="Battle against your friends"
              features={["Co Op Battles", "Online Battles"]}
              image={MultiPlayerImage}
              secondary
            ></GamemodeSelector>
          </div>
        </div>
      </WidthWrapper>
    </main>
  );
}
