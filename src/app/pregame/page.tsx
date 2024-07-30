import WidthWrapper from "@/wrappers/width-wrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../utils/game-data";
import Backdrop from "./backdrop";
import Difficulty from "./difficulty";
import Fighters from "./fighters";
import Game from "./game";
import GameSetup from "./game-setup.client";

export default async function Page() {
  const data = await DecryptGameDataAction({});
  function Redirection(path: string) {
    redirect(`${path}?redirected=true`);
  }

  if (!data.game_id) Redirection("/single");
  if (!data.difficulty) Redirection("/difficulty");
  if (!data.fighter_data) Redirection("/fighters");
  if (!data.backdrop) Redirection("/backdrop");

  const { fighter_data, game_id, backdrop, difficulty } = data;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-start">
      <WidthWrapper>
        <div className="relative flex w-full flex-col items-center justify-start gap-12 pb-10 xl:h-[100svh]">
          <h1 className="w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
            CONFIRM YOUR SELECTIONS
          </h1>
          <div className="flex h-fit w-full flex-col items-center justify-center gap-6 xl:flex-row xl:gap-20">
            <div className="flex h-fit w-[80%] flex-col items-start justify-start gap-6 xl:w-fit">
              <Game gameID={game_id!} />
              <Fighters fighter_data={fighter_data!} />
            </div>
            <div className="flex h-fit w-[80%] flex-col items-start justify-start gap-6 xl:w-fit">
              <Backdrop backdropID={backdrop!} />
              <Difficulty difficultyID={difficulty!} />
            </div>
          </div>
          <div className="flex h-fit w-[80%] flex-row flex-wrap items-center justify-center gap-6 px-2">
            <GameSetup />
            <Link
              href="/pregame/instructions"
              className="flex h-fit w-full shrink-0 scale-105 flex-col items-center justify-center rounded-md bg-purple-500 p-2 text-[15px] text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-100 xl:w-fit xl:p-4 xl:text-[20px]"
            >
              HOW TO PLAY
            </Link>
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}
