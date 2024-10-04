import { BackdropsList } from "../backdrop/backdrops";
import EditButton from "./edit.client";

export default function Backdrop({ backdropID }: { backdropID: string }) {
  const backdrop = BackdropsList.find(
    (game) => game.id === Number.parseInt(backdropID),
  )!;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-[150px] w-full flex-col items-center justify-center gap-2 md:w-fit xl:h-[200px] xl:w-[400px]">
        <div className="flex h-fit w-full flex-row items-end justify-start gap-2">
          <span className="text-lg text-yellow-500">4. </span>
          <p className="text-lg text-white md:text-xl xl:text-2xl">BACKDROP</p>
          <EditButton objKey="backdrop" />
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md bg-teal-500">
          <div className="line-clamp-2 h-fit w-fit">
            <p className="text-left text-sm font-bold text-white md:text-lg xl:text-xl">
              {backdrop.name.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
