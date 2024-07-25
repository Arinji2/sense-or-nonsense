import WidthWrapper from "@/wrappers/width-wrapper";

import { ConnectPBAdmin } from "@/../utils/connectPB";
import { GetUserMode } from "@/../utils/getMode";
import { ScoreSchema } from "@/../validations/scores/schema";
import { ScoresSchemaType } from "@/../validations/scores/types";
import { GamesList } from "@/app/games";
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
    <div className="relative flex h-[1px] min-h-[100svh] w-full flex-col items-center justify-center gap-2 xl:max-h-svh">
      <WidthWrapper>
        <h1 className="absolute top-5 z-50 px-2 text-center text-[25px] font-bold tracking-subtitle text-white md:static md:text-[40px] xl:text-[60px]">
          CHOOSE A GAME MODE
        </h1>

        <div className="flex h-full w-full snap-x snap-mandatory flex-row items-stretch justify-start overflow-x-scroll md:h-full xl:items-center">
          {GamesList.map((game) => {
            if (!game.isMultiplayer) return null;
            return (
              <GameComponent
                multi
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
