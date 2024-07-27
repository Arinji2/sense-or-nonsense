import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../../utils/game-data";

export default async function Page() {
  const data = await DecryptGameDataAction();
  if (!data.game_id || !data.difficulty || !data.fighter_data || !data.backdrop)
    redirect("/pregame");

  const { backdrop, difficulty, fighter_data, game, game_id } = data;

  console.log(game);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-start">
      <WidthWrapper>
        <div className="relative flex w-full flex-col items-center justify-start gap-12 pb-10 xl:h-[100svh]">
          <h1 className="w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
            GAME OVER
          </h1>
          <div className="flex h-full w-full flex-row items-center justify-center gap-10">
            <div className="flex h-full w-fit shrink-0 flex-col items-center justify-start gap-2">
              <div className=""></div>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start gap-2"></div>
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}
