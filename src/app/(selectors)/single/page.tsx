import WidthWrapper from "@/wrappers/width-wrapper";

import { ConnectPBAdmin } from "@/../utils/connectPB";
import { GetUserMode } from "@/../utils/getMode";
import { ScoreSchema } from "@/../validations/scores/schema";
import { ScoresSchemaType } from "@/../validations/scores/types";
import GAMEDATA from "@/app/games";
import { GameComponent } from "../GameComponent";

export default async function Page() {
  const { mode, userID } = await GetUserMode();
  let scores = [] as ScoresSchemaType;
  if (mode === "guest") {
    const pbAdmin = await ConnectPBAdmin();

    const pbScores = await pbAdmin.collection("scores").getFullList({
      filter: `user="${userID}"`,
    });

    pbScores.forEach((score) => {
      const parse = ScoreSchema.safeParse(score);

      if (parse.success) {
        scores.push(parse.data);
      }
    });
  }

  return (
    <div className="w-full h-[1px] gap-2 xl:max-h-svh min-h-[100svh] relative flex flex-col items-center justify-center">
      <WidthWrapper>
        <h1 className=" absolute md:static  z-50 top-5 font-bold tracking-subtitle px-2  text-white md:text-[40px] text-[25px] text-center xl:text-[60px]">
          CHOOSE A GAME MODE
        </h1>

        <div className="w-full md:h-full h-full flex flex-row  justify-start items-stretch xl:items-center overflow-x-scroll snap-x snap-mandatory  ">
          {GAMEDATA.map((game) => {
            if (game.isMultiplayer) return null;
            return (
              <GameComponent
                key={game.id}
                GameData={game}
                scoreData={scores.find((score) => score.game_id === game.id)}
              />
            );
          })}
        </div>
      </WidthWrapper>
    </div>
  );
}
