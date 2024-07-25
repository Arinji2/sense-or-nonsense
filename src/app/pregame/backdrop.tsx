import Image from "next/image";
import { BackdropsList } from "../backdrop/backdrops";
import EditButton from "./edit.client";

export default function Backdrop({ backdropID }: { backdropID: string }) {
  const backdrop = BackdropsList.find(
    (game) => game.id === Number.parseInt(backdropID),
  )!;
  return (
    <div className="flex h-fit w-full flex-col items-start justify-center gap-4">
      <div className="flex h-fit w-fit flex-row items-center justify-center gap-6">
        <p className="text-2xl font-medium tracking-text text-white md:text-3xl">
          <span className="text-yellow-500">3. </span>BACKDROP
        </p>
        <EditButton objKey="backdrop" reset />
      </div>
      <button className="relative flex aspect-video w-full flex-col items-start justify-end overflow-hidden rounded-md xl:w-[300px]">
        <Image
          src={backdrop.image}
          alt={`${backdrop.name}`}
          fill
          sizes="(min-width: 1280px) 25%, 90%"
          className="absolute object-cover brightness-50 transition-all duration-200 ease-in-out group-hover:brightness-100"
        />
        <div className="line-clamp-2 h-fit w-full bg-black/60 px-4 py-3 backdrop-blur-[1px]">
          <p className="text-left text-[15px] font-medium text-white xl:text-[20px]">
            {backdrop.name}
          </p>
        </div>
      </button>
    </div>
  );
}
