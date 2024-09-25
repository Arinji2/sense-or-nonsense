import Image from "next/image";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import { FightersList } from "../fighters/fighters";
import EditButton from "./edit.client";

export default function Fighters({
  fighter_data,
}: {
  fighter_data: GameFighterSchemaType[];
}) {
  const fighters = fighter_data!.map((fighter) => {
    const fighterData = FightersList.find(
      (fighterList) => fighterList.id === Number.parseInt(fighter.fighter_id),
    )!;

    return fighterData;
  });

  return (
    <div className="flex h-fit w-full flex-col items-start justify-center gap-4">
      <div className="flex h-fit w-fit flex-row items-center justify-center gap-6">
        <p className="text-2xl font-medium tracking-text text-white md:text-3xl">
          <span className="text-yellow-500">2. </span>FIGHTERS
        </p>
        <EditButton objKey="playerData" />
      </div>
      <div className="no-scrollbar flex h-fit w-full min-w-0 max-w-[300px] flex-row flex-wrap items-center justify-center gap-4 overflow-x-auto xl:flex-nowrap xl:justify-start">
        {fighters.map((fighter, index) => (
          <div
            key={fighter.id + index}
            className="flex h-fit w-full flex-col items-center justify-center rounded-sm bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque] px-4 py-6 xl:max-w-[500px]"
            style={
              {
                "--fighterColor": fighter.color,
                "--fighterColorOpaque": fighter.color + "80",
              } as React.CSSProperties
            }
          >
            <div className="flex h-full w-full flex-row items-end justify-between xl:pr-10">
              <div className="flex size-[50px] shrink-0 flex-col items-start justify-center xl:size-[100px]">
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
              <div className="flex h-full w-fit min-w-0 flex-col items-start justify-end gap-4">
                <h4 className="w-full truncate text-left text-[15px] font-bold text-white md:text-[20px]">
                  {fighter_data![index].fighter_name}{" "}
                </h4>
                <p className="whitespace-nowrap text-[15px] text-white">
                  PLAYER {index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
