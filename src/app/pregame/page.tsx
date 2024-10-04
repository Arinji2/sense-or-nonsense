import { Button } from "@/components/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ValidateGameIDCookie } from "../../../utils/game-data";
import { GameFighterSchemaType } from "../../../validations/game-data/types";
import Backdrop from "./backdrop";
import Difficulty from "./difficulty";
import Fighters from "./fighters";
import Game from "./game";
import GameSetup from "./game-setup.client";

export default async function Page() {
  const { gameData } = await ValidateGameIDCookie();
  function Redirection(path: string) {
    redirect(`${path}?redirected=true`);
  }

  if (!gameData.gameID) Redirection("/single");
  if (!gameData.difficulty) Redirection("/difficulty");
  if (gameData.playerData.length === 0) return Redirection("/fighters");
  if (!gameData.backdrop) Redirection("/backdrop");

  const { playerData, gameID, backdrop, difficulty } = gameData;
  const fighterData: GameFighterSchemaType[] = playerData.map((player) => {
    return {
      fighter_id: player.fighter_id,
      fighter_name: player.fighter_name,
      fighter_uid: player.fighter_uid,
    };
  });

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-center gap-16 px-4 py-10 xl:px-0"
      >
        <h1 className="text-center text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
          FINALIZE YOUR GAME
        </h1>
        <div className="flex h-fit w-full flex-col-reverse items-center justify-center gap-12 xl:flex-col">
          <div className="flex h-fit w-full flex-col items-center justify-center">
            <div className="grid w-full grid-cols-1 gap-12 md:w-fit xl:grid-cols-2 xl:grid-rows-2">
              <Game gameID={gameID!} />

              <Fighters fighter_data={fighterData!} />
              <Difficulty difficultyID={difficulty!} />
              <Backdrop backdropID={backdrop!} />
            </div>
          </div>
          <div className="flex h-fit w-[80%] flex-row flex-wrap items-center justify-center gap-6 px-2">
            <GameSetup />
            <Link
              href="/pregame/instructions"
              className="h-fit w-full xl:w-fit"
            >
              <Button className="w-full bg-purple-500 text-white xl:w-fit">
                HOW TO PLAY
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
