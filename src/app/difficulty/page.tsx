import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../utils/game-data";
import Selector from "./selector.client";

export default async function Page({}) {
  const data = await DecryptGameDataAction({});
  if (!data.game_id) redirect("/single");

  return (
    <WidthWrapper>
      <div className="relative flex h-fit min-h-[100svh] w-full flex-col items-center justify-start gap-10 py-10">
        <h1 className="z-20 w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
          SELECT A DIFFICULTY
        </h1>
        <div className="flex h-fit w-[95%] flex-row flex-wrap items-center justify-center gap-10 xl:w-full">
          <Selector />
        </div>
      </div>
    </WidthWrapper>
  );
}
