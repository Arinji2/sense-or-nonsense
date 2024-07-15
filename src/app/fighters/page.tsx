import WidthWrapper from "@/wrappers/width-wrapper";
import Selector from "./selector";

export default async function Page() {
  return (
    <WidthWrapper>
      <div className="w-full h-[100svh] relative flex flex-col xl:flex-row gap-10 items-center xl:justify-between justify-start">
        <h1 className=" font-bold tracking-subtitle xl:leading-[100px] text-red-500 px-2   w-full md:text-[40px] text-[35px] text-center xl:text-[60px]">
          SELECT <span className="xl:block inline">YOUR</span>{" "}
          <span className="xl:block inline">FIGHTER</span>
        </h1>
        <Selector />
      </div>
    </WidthWrapper>
  );
}
