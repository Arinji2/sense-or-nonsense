import WidthWrapper from "@/wrappers/width-wrapper";
import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../utils/game-data";
import Selector from "./selector.client";

export default async function Page({}) {
  const data = await DecryptGameDataAction();
  if (!data.game_id) redirect("/single");

  return (
    <WidthWrapper>
      <div className="w-full h-fit min-h-[100svh]  relative flex flex-col py-10  gap-10 items-center justify-start">
        <h1 className=" z-20 font-bold tracking-subtitle xl:leading-[100px] text-white px-2   w-full md:text-[40px] text-[35px] text-center xl:text-[60px]">
          SELECT A DIFFICULTY
        </h1>
        <div className="w-[95%] xl:w-full h-fit flex flex-row items-center justify-center gap-10 flex-wrap">
          <Selector />
        </div>
      </div>
    </WidthWrapper>
  );
}
