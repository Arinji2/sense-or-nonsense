import WidthWrapper from "@/wrappers/width-wrapper";
import Image from "next/image";
import { BackdropSelected } from "../../../validations/generic/types";
import { BackdropsList } from "./backdrops";
import Menu from "./menu";
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
  } as BackdropSelected;
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
    <div className="w-full h-fit   relative flex flex-col items-center justify-start">
      {selectedBackdropData.verified && (
        <div className="w-full h-[100svh] fixed top-0 left-0">
          <Image
            src={BackdropsList[selectedBackdropData.id].image}
            alt="Backdrop"
            fill
            className="brightness-[.1] fixed object-cover"
          />
        </div>
      )}
      <WidthWrapper>
        <div className="w-full h-fit   relative flex flex-col py-10  gap-10 items-center justify-start">
          <h1 className=" z-20 font-bold tracking-subtitle xl:leading-[100px] text-white px-2   w-full md:text-[40px] text-[35px] text-center xl:text-[60px]">
            SELECT A BACKDROP
          </h1>
          <Selector backdropData={selectedBackdropData} />
          <Menu backdrop={selectedBackdropData} />
        </div>
      </WidthWrapper>
    </div>
  );
}
