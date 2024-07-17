"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { BackdropsList } from "./backdrops";

function Backdrop({ data }: { data: (typeof BackdropsList)[0] }) {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const router = useRouter();
  const isSelected = useMemo(() => {
    return params.get("selected") === data.id.toString();
  }, [params, data.id]);

  return (
    <button
      onClick={() => {
        params.set("selected", data.id.toString());
        window.history.pushState(null, "", `?${params.toString()}`);

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }}
      className={cn({
        "w-full xl:w-[25%] group h-[200px] rounded-md overflow-hidden flex flex-col items-start justify-end  shrink-0 relative":
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
          "object-cover absolute brightness-50 group-hover:brightness-100 transition-all ease-in-out duration-200":
            true,
          "brightness-100": isSelected,
        })}
      />
      <div className="w-full line-clamp-2 bg-black/60 backdrop-blur-[1px] h-fit px-4 py-3">
        <p className="text-white font-medium text-[15px] xl:text-[20px] text-left ">
          {data.name}
        </p>
      </div>
    </button>
  );
}

export function Selector() {
  return (
    <div className="w-[90%] z-20 xl:w-full py-10 h-fit flex flex-row items-center justify-center gap-10 flex-wrap">
      {BackdropsList.map((backdrop) => (
        <Backdrop key={backdrop.id} data={backdrop} />
      ))}
    </div>
  );
}
