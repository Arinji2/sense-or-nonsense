import Image from "next/image";
import { FightersList } from "../../../constants/fighters";
import { cn } from "../../../utils/cn";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import EditButton from "./edit.client";

export default function Fighters({
  fighter_data,
}: {
  fighter_data: GameFighterSchemaType[];
}) {
  const fighters = fighter_data!.map((fighter) => {
    const fighterData = FightersList.find(
      (fighterList) => fighterList.id === fighter.fighter_id,
    )!;

    return fighterData;
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-fit w-full flex-col items-center justify-center gap-2 md:w-fit xl:h-[200px] xl:w-[400px]">
        <div className="flex h-fit w-full flex-row items-end justify-start gap-2">
          <span className="text-lg text-yellow-500">2. </span>
          <p className="text-lg text-white md:text-xl xl:text-2xl">FIGHTERS</p>
          <EditButton objKey="playerData" />
        </div>
        <div className="no-scrollbar flex h-full w-full flex-row flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-sm xl:flex-nowrap xl:justify-start">
          {fighters.map((fighter, index) => (
            <div
              key={fighter.id + index}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center rounded-sm bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque] px-5 py-6 xl:shrink-0 xl:px-2",
                {
                  "xl:w-[250px]": fighters.length > 1,
                },
              )}
              style={
                {
                  "--fighterColor": fighter.color,
                  "--fighterColorOpaque": fighter.color + "80",
                } as React.CSSProperties
              }
            >
              <div className="flex h-full w-full flex-row items-center justify-between xl:pr-10">
                <div className="flex size-[60px] shrink-0 flex-col items-start justify-center xl:size-[100px]">
                  <div className="relative h-full w-full overflow-hidden rounded-sm">
                    <Image
                      alt={fighter_data![index].fighter_name ?? "Unknown"}
                      src={fighter.image}
                      fill
                      sizes="(min-width: 1280px) 100px, 50px"
                      className="object-contain opacity-80"
                    />
                  </div>
                </div>
                <div className="flex h-full w-full flex-col items-end justify-center gap-4 xl:ml-auto">
                  <h4 className="line-clamp-1 text-left text-sm font-bold text-white md:text-base">
                    {fighter_data![index].fighter_name}
                  </h4>
                  <p className="whitespace-nowrap text-xs text-white/70">
                    PLAYER {index + 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
