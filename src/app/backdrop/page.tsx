import Image from "next/image";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { BackdropSelected } from "../../../validations/generic/types";
import { BackdropsList } from "./backdrops";
import Menu from "./menu.client";
import { Selector } from "./selector.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    selected: undefined | string | string[];
    setDefaults: string | string[] | undefined;
  };
}) {
  let isSettingDefaults = false;
  if (searchParams.setDefaults && !Array.isArray(searchParams.setDefaults)) {
    if (searchParams.setDefaults === "true") isSettingDefaults = true;
  }

  if (!isSettingDefaults) {
    await ValidateGameIDCookie();
  }
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
      selectedBackdropData.id = BackdropsList[selectedBackdrop].id;
    }
  }

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E]">
      {selectedBackdropData.verified && (
        <div className="fixed left-0 top-0 h-[100svh] w-full">
          <Image
            src={
              BackdropsList.find(
                (backdrop) => backdrop.id === selectedBackdropData.id,
              )!.image
            }
            alt="Backdrop"
            fill
            className="fixed object-cover brightness-[.1]"
          />
        </div>
      )}
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-center gap-10 px-4 py-10 xl:px-0"
      >
        <div className="relative flex h-fit w-full flex-col items-center justify-start gap-10 py-10">
          <h1 className="text-center text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
            SELECT A BACKDROP
          </h1>
          <Selector backdropData={selectedBackdropData} />
          <Menu
            isSettingDefaults={isSettingDefaults}
            backdrop={selectedBackdropData}
          />
        </div>
      </div>
    </div>
  );
}
