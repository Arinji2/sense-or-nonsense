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
      (fighterList) => fighterList.id === Number.parseInt(fighter.fighter_id)
    )!;

    return fighterData;
  });
  return (
    <div className="w-full h-fit flex flex-col items-start justify-center gap-4">
      <div className="w-fit h-fit flex flex-row items-center justify-center gap-6">
        <p className="text-2xl md:text-3xl text-white font-medium tracking-text">
          <span className="text-yellow-500">2. </span>FIGHTERS
        </p>
        <EditButton objKey="fighter_data" />
      </div>
      <div className=" w-full max-w-[300px] min-w-0 h-fit flex xl:flex-nowrap overflow-x-auto flex-wrap flex-row items-center xl:justify-start no-scrollbar justify-center gap-4">
        {fighters.map((fighter, index) => (
          <div
            key={fighter.id + index}
            className="w-full  xl:max-w-[500px] h-fit py-6 px-4 bg-gradient-to-r from-[--fighterColor] from-[60%] to-[--fighterColorOpaque]  rounded-sm flex flex-col items-center justify-center"
            style={
              {
                "--fighterColor": fighter.color,
                "--fighterColorOpaque": fighter.color + "80",
              } as React.CSSProperties
            }
          >
            <div className="w-full  h-full flex flex-row items-end justify-between xl:pr-10">
              <div className=" xl:size-[100px] size-[50px] shrink-0 flex flex-col items-start justify-center">
                <div className="relative w-full h-full rounded-sm overflow-hidden">
                  <Image
                    alt={fighter_data![index].fighter_name ?? "Unknown"}
                    src={fighter.image}
                    fill
                    sizes="(min-width: 1280px) 100px, 50px"
                    className="opacity-80 object-contain"
                  />
                </div>
              </div>
              <div className="w-fit  h-full flex flex-col min-w-0 items-start justify-end gap-4">
                <h4 className="font-bold text-[15px] w-full text-left truncate  md:text-[20px] text-white">
                  {fighter_data![index].fighter_name}{" "}
                </h4>
                <p className="text-[15px] text-white whitespace-nowrap">
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
