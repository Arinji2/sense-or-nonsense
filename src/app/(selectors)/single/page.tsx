import { GetUserMode } from "@/../utils/getMode";
import { GamesList } from "@/app/games";

import { GameComponent } from "../GameComponent";

export default async function Page() {
  const { userID, pb } = await GetUserMode();
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-center gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-center text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
          CHOOSE A GAME MODE
        </h1>
        <div className="flex h-fit w-full snap-x snap-mandatory flex-row items-stretch justify-start overflow-x-auto md:h-full xl:items-center">
          {GamesList.map((game) => {
            if (game.isMultiplayer) return null;
            return (
              <GameComponent
                key={game.id}
                GameData={game}
                userID={userID!}
                pb={pb!}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
