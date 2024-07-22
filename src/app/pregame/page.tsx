import WidthWrapper from "@/wrappers/width-wrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../utils/game-data";
import Backdrop from "./backdrop";
import Difficulty from "./difficulty";
import Fighters from "./fighters";
import Game from "./game";

export default async function Page() {
  const data = await DecryptGameDataAction();
  function Redirection(path: string) {
    redirect(`${path}?redirected=true`);
  }

  if (!data.game_id) Redirection("/single");
  if (!data.difficulty) Redirection("/difficulty");
  if (!data.fighter_data) Redirection("/fighters");
  if (!data.backdrop) Redirection("/backdrop");

  const { fighter_data, game_id, backdrop, difficulty } = data;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-start">
      <WidthWrapper>
        <div className="w-full pb-10 xl:h-[100svh] relative flex flex-col items-center gap-12 justify-start">
          <h1 className=" font-bold tracking-subtitle xl:leading-[100px] text-white px-2   w-full md:text-[40px] text-[35px] text-center xl:text-[60px]">
            CONFIRM YOUR SELECTIONS
          </h1>
          <div className="w-full  h-fit flex flex-col gap-6 xl:flex-row items-center justify-center xl:gap-20">
            <div className="xl:w-fit w-[80%] h-fit flex flex-col items-start justify-start gap-6">
              <Game gameID={game_id!} />
              <Fighters fighter_data={fighter_data!} />
            </div>
            <div className="xl:w-fit w-[80%] h-fit flex flex-col items-start justify-start gap-6">
              <Backdrop backdropID={backdrop!} />
              <Difficulty difficultyID={difficulty!} />
            </div>
          </div>
          <div className="w-[80%] px-2 h-fit flex flex-row items-center  justify-center gap-6 flex-wrap">
            <Link
              href="/game"
              className="xl:w-fit  w-full shrink-0 h-fit will-change-transform text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-green-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
            >
              START GAME{" "}
            </Link>
            <Link
              href="/pregame/instructions"
              className="xl:w-fit  w-full shrink-0 h-fit will-change-transform text-[15px] xl:text-[20px] hover:scale-100 scale-105 transition-transform ease-in-out duration-200  bg-purple-500 text-white rounded-md p-2 xl:p-4 flex flex-col items-center justify-center"
            >
              HOW TO PLAY
            </Link>
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}
