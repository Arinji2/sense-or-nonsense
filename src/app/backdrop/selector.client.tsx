"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../utils/cn";
import { NameFormat } from "../../../utils/formatting";
import { BackdropSelected } from "../../../validations/generic/types";
import { BackdropsList } from "./backdrops";

function Backdrop({
  data,
  backdropData,
}: {
  data: (typeof BackdropsList)[0];
  backdropData: BackdropSelected;
}) {
  const searchParams = useSearchParams();
  const backdropRef = useRef<HTMLButtonElement>(null);
  const params = new URLSearchParams(searchParams);

  const pathname = usePathname();
  const router = useRouter();
  const isSelected = useMemo(
    () => backdropData.verified && backdropData.id === data.id,
    [backdropData, data],
  );

  useEffect(() => {
    if (isSelected) {
      backdropRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isSelected]);

  return (
    <button
      ref={backdropRef}
      onClick={() => {
        params.set("selected", data.id.toString());
        toast.success(`Now Viewing ${NameFormat(data.name)} Backdrop`);
        window.history.pushState(null, "", `?${params.toString()}`);

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }}
      className={cn({
        "group relative flex h-[200px] w-full shrink-0 flex-col items-start justify-end overflow-hidden rounded-md xl:w-[25%]":
          true,
        "shadow-xl shadow-white/10": isSelected,
      })}
    >
      <Image
        src={data.image}
        alt={`${data.name} backdrop`}
        fill
        sizes="(min-width: 1280px) 25%, 90%"
        className={cn({
          "absolute object-cover brightness-50 transition-all duration-200 ease-in-out group-hover:brightness-100":
            true,
          "brightness-100": isSelected,
          "brightness-[.2]": !isSelected && backdropData.verified,
        })}
      />
      <div className="line-clamp-2 h-fit w-full bg-black/60 px-4 py-3 backdrop-blur-[1px]">
        <p className="text-left text-xs font-medium text-white xl:text-sm">
          {data.name}
        </p>
      </div>
    </button>
  );
}

export function Selector({ backdropData }: { backdropData: BackdropSelected }) {
  return (
    <div className="z-20 flex h-fit w-[90%] flex-row flex-wrap items-center justify-center gap-10 py-10 xl:w-full">
      {BackdropsList.map((backdrop) => (
        <Backdrop
          key={backdrop.id}
          data={backdrop}
          backdropData={backdropData}
        />
      ))}
    </div>
  );
}
