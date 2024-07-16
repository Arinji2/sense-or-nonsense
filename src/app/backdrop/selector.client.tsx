"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BackdropsList } from "./backdrops";

function Backdrop({ data }: { data: (typeof BackdropsList)[0] }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        params.set("selected", data.id.toString());
        window.history.pushState(null, "", `?${params.toString()}`);

        router.replace(`${pathname}?${params.toString()}`);
      }}
      className="w-full xl:w-[25%] h-[200px] rounded-md overflow-hidden flex flex-col items-start justify-end  shrink-0 relative"
    >
      <Image
        src={data.image}
        alt={`${data.name} backdrop`}
        fill
        sizes="(min-width: 1280px) 25%, 90%"
        className="object-cover absolute"
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
    <div className="w-[90%] z-20 xl:w-full  h-fit flex flex-row items-center justify-center gap-10 flex-wrap">
      {BackdropsList.map((backdrop) => (
        <Backdrop key={backdrop.id} data={backdrop} />
      ))}
    </div>
  );
}
