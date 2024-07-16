import WidthWrapper from "@/wrappers/width-wrapper";
import Image from "next/image";
import { BackdropsList } from "./backdrops";
import { Selector } from "./selector.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    selected: undefined | string | string[];
  };
}) {
  const { selected } = searchParams;
  const selectedBackdropData = {
    verified: false,
    id: 0,
  };
  if (
    selected &&
    !Array.isArray(selected) &&
    Number.isInteger(Number.parseInt(selected))
  ) {
    const selectedBackdrop = BackdropsList.findIndex(
      (backdrop) => backdrop.id === Number.parseInt(selected)
    );

    if (selectedBackdrop !== -1) {
      selectedBackdropData.verified = true;
      selectedBackdropData.id = selectedBackdrop;
    }
  }
  return (
    <>
      {selectedBackdropData.verified && (
        <Image
          src={BackdropsList[selectedBackdropData.id].image}
          alt="Backdrop"
          fill
          className="brightness-[.1]"
        />
      )}
      <WidthWrapper>
        <div className="w-full   min-h-[100svh] relative flex flex-col py-10  gap-10 items-center justify-start">
          <h1 className=" z-20 font-bold tracking-subtitle xl:leading-[100px] text-white px-2   w-full md:text-[40px] text-[35px] text-center xl:text-[60px]">
            SELECT A BACKDROP
          </h1>
          <Selector />
        </div>
      </WidthWrapper>
    </>
  );
}
