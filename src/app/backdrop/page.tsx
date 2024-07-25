import WidthWrapper from "@/wrappers/width-wrapper";
import Image from "next/image";
import { BackdropSelected } from "../../../validations/generic/types";
import { BackdropsList } from "./backdrops";
import Menu from "./menu.client";
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
      (backdrop) => backdrop.id === Number.parseInt(selected),
    );

    if (selectedBackdrop !== -1) {
      selectedBackdropData.verified = true;
      selectedBackdropData.id = selectedBackdrop;
    }
  }
  return (
    <div className="relative flex h-fit w-full flex-col items-center justify-start">
      {selectedBackdropData.verified && (
        <div className="fixed left-0 top-0 h-[100svh] w-full">
          <Image
            src={BackdropsList[selectedBackdropData.id].image}
            alt="Backdrop"
            fill
            className="fixed object-cover brightness-[.1]"
          />
        </div>
      )}
      <WidthWrapper>
        <div className="relative flex h-fit w-full flex-col items-center justify-start gap-10 py-10">
          <h1 className="z-20 w-full px-2 text-center text-[35px] font-bold tracking-subtitle text-white md:text-[40px] xl:text-[60px] xl:leading-[100px]">
            SELECT A BACKDROP
          </h1>
          <Selector backdropData={selectedBackdropData} />
          <Menu backdrop={selectedBackdropData} />
        </div>
      </WidthWrapper>
    </div>
  );
}
