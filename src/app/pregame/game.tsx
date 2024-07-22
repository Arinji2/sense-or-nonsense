import Image from "next/image";
import { GamesList } from "../games";
import EditButton from "./edit.client";

export default function Game({ gameID }: { gameID: string }) {
  const game = GamesList.find((game) => game.id === Number.parseInt(gameID))!;
  return (
    <div className="w-full h-fit flex flex-col items-start justify-center gap-4">
      <div className="w-fit h-fit flex flex-row items-center justify-center gap-6">
        <p className="text-2xl md:text-3xl text-white font-medium tracking-text">
          <span className="text-yellow-500">1. </span>GAME
        </p>
        <EditButton objKey="game_id" reset />
      </div>
      <button className="xl:w-[300px] w-full aspect-video rounded-md overflow-hidden flex flex-col items-start justify-end  relative">
        <Image
          src={game.image}
          alt={`${game.title}`}
          fill
          sizes="(min-width: 1280px) 25%, 90%"
          className="object-cover absolute brightness-50 group-hover:brightness-100 transition-all ease-in-out duration-200"
        />
        <div className="w-full line-clamp-2 bg-black/60 backdrop-blur-[1px] h-fit px-4 py-3">
          <p className="text-white font-medium text-[15px] xl:text-[20px] text-left ">
            {game.title}
          </p>
        </div>
      </button>
    </div>
  );
}
