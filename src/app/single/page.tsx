import WidthWrapper from "@/wrappers/width-wrapper";
import Image from "next/image";
import CPUImage from "../../../public/modes/cpu.png";
import HighScoreImage from "../../../public/modes/highscore.png";
import { cn } from "../../../utils/cn";

const games = [
  {
    id: 0,
    title: "HIGH SCORE BATTLE",
    image: HighScoreImage,
    description:
      "Play against varying difficulties and improve your high scores",
    showLeft: true,
  },
  {
    id: 1,
    title: "PLAYER VS CPU",
    image: CPUImage,
    description: "Test your skills against the computer in a 1v1 match",
  },
];

export default async function Page() {
  return (
    <div className="w-full h-[1px] gap-2 xl:max-h-svh min-h-[100svh] relative flex flex-col items-center justify-center">
      <WidthWrapper>
        <h1 className=" absolute md:static  z-50 top-5 font-bold tracking-subtitle px-2  text-white md:text-[40px] text-[25px] text-center xl:text-[60px]">
          CHOOSE A GAME MODE
        </h1>

        <div className="w-full md:h-full h-full flex flex-row   justify-start items-stretch overflow-x-scroll snap-x snap-mandatory  ">
          <GameComponent GameData={games[0]} />
          <GameComponent GameData={games[1]} />
        </div>
      </WidthWrapper>
    </div>
  );
}

function GameComponent({ GameData }: { GameData: any }) {
  return (
    <div className="w-full rounded-md  relative flex flex-col items-start justify-center grow snap-center shrink-0">
      <Image
        className={cn(
          {
            "object-cover absolute brightness-[0.3] blur-sm top-0 left-0 ":
              true,
          },
          { "object-left": GameData.showLeft }
        )}
        src={GameData.image}
        alt={GameData.description}
        fill
      />
      <div className=" w-full md:h-full md:w-fit flex flex-col bg-black/60 rounded-r-md items-start md:items-start gap-10 pt-32 md:pt-10  px-2 md:px-10 py-4 justify-center  z-20 h-full">
        <h2 className="text-[#DE6A38] font-bold tracking-text text-[25px] md:text-[50px]">
          {GameData.title}
        </h2>
        <p className="text-[15px] md:text-[20px] text-white font-medium tracking-text">
          {GameData.description}
        </p>
        <div className="w-full h-fit gap-5 flex flex-col items-start justify-start">
          <h3 className="text-[20px] md:text-[30px] font-bold text-white">
            HIGH SCORES:
          </h3>
          <div className="w-full h-fit flex flex-row flex-wrap items-center justify-start gap-10">
            <div className="w-fit h-fit flex flex-row items-center justify-center gap-3">
              <p className="font-bold text-[20px] md:text-[50px] text-[#FCAB3A]">
                1.
              </p>
              <div className="w-fit h-fit flex flex-col items-start justify-start gap-1">
                <h4 className="font-bold  text-[15px] md:text-[30px] text-[#FCAB3A]">
                  EASY
                </h4>
                <p className="font-bold  text-[15px] md:text-[30px] text-white">
                  0
                </p>
              </div>
            </div>
            <div className="w-fit h-fit flex flex-row items-center justify-center gap-3">
              <p className="font-bold text-[20px] md:text-[50px] text-[#FCAB3A]">
                2.
              </p>
              <div className="w-fit h-fit flex flex-col items-start justify-start gap-1">
                <h4 className="font-bold  text-[15px] md:text-[30px] text-[#FCAB3A]">
                  MEDIUM
                </h4>
                <p className="font-bold  text-[15px] md:text-[30px] text-white">
                  0
                </p>
              </div>
            </div>
            <div className="w-fit h-fit flex flex-row items-center justify-center gap-3">
              <p className="font-bold text-[20px] md:text-[50px] text-[#FCAB3A]">
                3.
              </p>
              <div className="w-fit h-fit flex flex-col items-start justify-start gap-1">
                <h4 className="font-bold  text-[15px] md:text-[30px] text-[#FCAB3A]">
                  HARD
                </h4>
                <p className="font-bold  text-[15px] md:text-[30px] text-white">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-5 mt-auto">
          <p className="text-white text-[15px] shrink-0 bg-green-500 p-2 px-4 rounded-sm">
            PLAY NOW
          </p>
          <p className="text-white text-[15px] shrink-0 bg-blue-500 p-2 px-4 rounded-sm">
            PLAY MULTIPLAYER
          </p>
        </div>
      </div>
    </div>
  );
}
