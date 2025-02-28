import GamesImage from "@/../public/home/games.png";
import PlayersImage from "@/../public/home/players.png";
import RoundsImage from "@/../public/home/rounds.webp";
import Image from "next/image";

export default function Stats() {
  return (
    <div className="z-20 flex h-fit w-full flex-col items-center justify-center bg-[#2C2828]">
      <div className="flex h-full w-full max-w-full-page flex-col items-center justify-start gap-20 py-20">
        <h2 className="text-center text-3xl font-bold tracking-title text-blue-500 xl:text-5xl">
          STATS
        </h2>
        <div className="flex h-fit w-[80%] flex-row flex-wrap items-center justify-center gap-10 xl:w-full">
          <div className="group relative flex h-[150px] w-full flex-col items-center justify-center overflow-hidden rounded-md shadow-md shadow-black xl:w-[450px]">
            <Image
              src={PlayersImage}
              sizes="(min-width: 1280px)600px, 100vw"
              fill
              alt="Players Image"
              className="absolute left-0 top-0 object-cover brightness-75 transition-all duration-300 ease-in-out will-change-transform group-hover:scale-125"
            />
            <div className="absolute z-10 h-full w-full bg-[#1E1E1E]/90"></div>
            <p className="z-20 text-sm font-bold text-white/70 md:text-lg">
              Players: <span className="text-teal-500">2500+</span>
            </p>
          </div>
          <div className="group relative flex h-[150px] w-full flex-col items-center justify-center overflow-hidden rounded-md shadow-md shadow-black xl:w-[450px]">
            <Image
              src={GamesImage}
              sizes="(min-width: 1280px)450px, 100vw"
              alt="Games Image"
              fill
              className="absolute left-0 top-0 object-cover brightness-75 transition-all duration-300 ease-in-out will-change-transform group-hover:scale-125"
            />
            <div className="absolute z-10 h-full w-full bg-[#1E1E1E]/90"></div>
            <p className="z-20 text-sm font-bold text-white md:text-lg">
              Games: <span className="text-pink-500">2800+</span>
            </p>
          </div>
          <div className="group relative flex h-[150px] w-full flex-col items-center justify-center overflow-hidden rounded-md shadow-md shadow-black xl:w-[450px]">
            <Image
              src={RoundsImage}
              sizes="(min-width: 1280px)450px, 100vw"
              alt="Rounds Image"
              fill
              className="absolute left-0 top-0 object-cover brightness-75 transition-all duration-300 ease-in-out will-change-transform group-hover:scale-125"
            />
            <div className="absolute z-10 h-full w-full bg-[#1E1E1E]/90"></div>
            <p className="z-20 text-sm font-bold text-white md:text-lg">
              Rounds: <span className="text-green-500">5000+</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
