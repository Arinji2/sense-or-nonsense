import { FightersList } from "@/../constants/fighters";
import { BackdropsList } from "@/app/backdrop/backdrops";
import { DifficultyList } from "@/app/difficulty/difficully";
import Image from "next/image";
import { SummaryData } from "../../../../../validations/generic/types";
import { GameSchemaType } from "../../../../../validations/pb/types";

export function GameStats({ data }: { data: SummaryData }) {
  return (
    <div className="flex h-fit w-full flex-col items-start justify-start gap-6 md:h-full">
      <h2 className="text-lg text-white md:text-2xl">GAME STATS</h2>
      <div className="flex h-fit w-full flex-row items-center justify-start gap-2 xl:w-fit xl:justify-center">
        <div className="flex h-full w-fit flex-col items-end justify-center gap-3">
          <p className="tracking-text text-xs text-white xl:text-sm xl:text-white/40">
            CORRECT:
          </p>
          <p className="tracking-text text-xs text-white xl:text-sm xl:text-white/40">
            INCORRECT:
          </p>
          <p className="tracking-text text-xs text-white xl:text-sm xl:text-white/40">
            ACCURACY:
          </p>
          <p className="tracking-text text-xs text-white xl:text-sm xl:text-white/40">
            MAX STREAK:
          </p>
          <p className="tracking-text text-xs text-white xl:text-sm xl:text-white/40">
            TIME PLAYED:
          </p>
        </div>
        <div className="flex h-full w-fit flex-col items-start justify-center gap-3">
          <p className="tracking-text text-xs text-blue-500 xl:text-sm">
            {data.correct}
          </p>
          <p className="tracking-text text-xs text-blue-500 xl:text-sm">
            {data.incorrect}
          </p>
          <p className="tracking-text text-xs text-blue-500 xl:text-sm">
            {Math.round((data.correct / (data.correct + data.incorrect)) * 100)}
            %
          </p>
          <p className="tracking-text text-xs text-blue-500 xl:text-sm">
            {data.maxStreak.value}
          </p>
          <p className="tracking-text text-xs text-blue-500 xl:text-sm">
            {data.timePlayed}s
          </p>
        </div>
      </div>
    </div>
  );
}

export function GameInfo({
  gameData,
  index,
}: {
  gameData: GameSchemaType;
  index: number;
}) {
  const { backdrop, difficulty, playerData } = gameData;

  const fighterData = {
    user: playerData[index],
    additional: FightersList.find(
      (fighter) => fighter.id === playerData[index].fighter_id,
    )!,
  };

  const backdropData = BackdropsList.find(
    (game) => game.id === Number.parseInt(backdrop),
  )!;
  const difficultyData = DifficultyList.find(
    (game) => game.level === Number.parseInt(difficulty),
  )!;

  return (
    <div
      style={
        {
          "--fighterColor": fighterData.additional.color,
          "--fighterColorOpaque": fighterData.additional.color + "80",
        } as React.CSSProperties
      }
      className="flex h-full w-full flex-col items-start justify-start gap-6"
    >
      <h2 className="text-lg text-white md:text-2xl">GAME INFO</h2>
      <div className="flex h-fit w-full flex-col items-center justify-center gap-2 xl:w-fit xl:opacity-50">
        <div
          key={fighterData.additional.id + index}
          className="flex h-fit w-full max-w-[500px] flex-col items-center justify-center rounded-sm bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque] p-4 px-2 xl:min-w-[250px] xl:max-w-[500px]"
        >
          <div className="flex h-full w-full flex-row items-end justify-between">
            <div className="flex size-[40px] shrink-0 flex-col items-start justify-center gap-2 xl:size-[50px]">
              <div className="relative h-full w-full overflow-hidden rounded-sm">
                <Image
                  alt={fighterData.user.fighter_name ?? "Unknown"}
                  src={fighterData.additional.image}
                  fill
                  sizes="(min-width: 1280px) 50px, 40px"
                  className="object-contain opacity-80"
                />
              </div>
            </div>
            <div className="flex h-fit w-fit min-w-0 flex-col items-start justify-end">
              <h4 className="w-full truncate text-right text-[10px] font-bold text-white md:text-[12px]">
                {fighterData.user.fighter_name}{" "}
              </h4>
              <p className="whitespace-nowrap text-[10px] text-white md:text-[10px]">
                PLAYER {index + 1}
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex h-[50px] w-full max-w-[500px] flex-col items-start justify-end overflow-hidden rounded-sm">
          <Image
            src={backdropData.image}
            alt={`${backdropData.name}`}
            fill
            sizes="(min-width: 1280px) 25%, 90%"
            className="absolute object-cover brightness-50 transition-all duration-200 ease-in-out group-hover:brightness-100"
          />
          <div className="line-clamp-2 h-fit w-fit px-4 py-3 backdrop-blur-[1px]">
            <p className="text-left text-[8px] font-medium text-white xl:text-[10px]">
              {backdropData.name}
            </p>
          </div>
        </div>
        <div
          style={
            {
              "--difficultyColor": difficultyData.color + "60",
            } as React.CSSProperties
          }
          className="relative flex h-[50px] w-full max-w-[500px] flex-col items-center justify-center overflow-hidden rounded-sm bg-[--difficultyColor]"
        >
          <div className="line-clamp-2 h-fit w-fit px-4 py-3">
            <p className="text-left text-[15px] font-medium text-white xl:text-[15px]">
              {difficultyData.name.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
