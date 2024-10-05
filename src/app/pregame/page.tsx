import { GetUserMode } from "@/../utils/getMode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Instructions from "../(home)/instructions";
import { GetGameData } from "../../../utils/game-data";
import { DeleteGameButton, StartGameButton } from "./buttons.client";

export default async function Page() {
  const { userID, pb } = await GetUserMode();
  const gameID = cookies().get("game-id")?.value;
  if (!gameID) redirect("/");
  const { gameData } = await GetGameData(pb, gameID, userID!);

  if (!gameData.difficulty) {
    redirect("/difficulty?redirected=true");
  } else if (gameData.playerData.length === 0) {
    redirect("/fighters?redirected=true");
  } else if (gameData.backdrop === "") {
    redirect("/backdrop?redirected=true");
  }
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E]">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-center justify-center gap-10 px-4 py-10 xl:px-0"
      >
        <h1 className="text-center text-lg font-bold tracking-title text-white md:text-2xl xl:text-3xl">
          PREGAME ROOM
        </h1>
        <div className="flex h-fit w-full flex-col items-center justify-center gap-14 md:h-full xl:gap-10">
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 md:flex-row">
            <StartGameButton />
            <DeleteGameButton />
          </div>
          <Instructions
            hideStartButton={true}
            className="bg-transparent py-0 xl:scale-[.8]"
            secondary
          />
        </div>
      </div>
    </div>
  );
}
