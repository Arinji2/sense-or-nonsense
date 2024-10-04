import { GamesList } from "../games";
import EditButton from "./edit.client";

export default function Game({ gameID }: { gameID: string }) {
  const game = GamesList.find((game) => game.id === Number.parseInt(gameID))!;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-[150px] w-full flex-col items-center justify-center gap-2 md:w-fit xl:h-[200px] xl:w-[400px]">
        <div className="flex h-fit w-full flex-row items-end justify-start gap-2">
          <span className="text-lg text-yellow-500">1. </span>
          <p className="text-lg text-white md:text-xl xl:text-2xl">GAME MODE</p>
          <EditButton objKey="game" />
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md bg-indigo-500">
          <div className="line-clamp-2 h-fit w-fit">
            <p className="text-center text-sm font-bold text-white md:text-lg xl:text-xl">
              {game.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
