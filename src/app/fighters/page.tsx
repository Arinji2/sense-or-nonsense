import WidthWrapper from "@/wrappers/width-wrapper";
import Selector from "./selector.client";

export default async function Page() {
  return (
    <WidthWrapper>
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-start gap-10 xl:flex-row xl:justify-between">
        <h1 className="w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-red-500 md:text-[40px] xl:text-[60px] xl:leading-[100px]">
          SELECT <span className="inline xl:block">YOUR</span>{" "}
          <span className="inline xl:block">FIGHTER</span>
        </h1>
        <Selector />
      </div>
    </WidthWrapper>
  );
}
