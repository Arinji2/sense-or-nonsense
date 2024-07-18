import { redirect } from "next/navigation";
import { DecryptGameDataAction } from "../../../utils/game-data";

export default async function Page() {
  const data = await DecryptGameDataAction();
  function Redirection(path: string) {
    redirect(`${path}?redirected=true`);
  }

  if (!data.game_id) Redirection("/single");
  if (!data.difficulty) Redirection("/difficulty");
  if (!data.fighter_data) Redirection("/fighters");
  if (!data.backdrop) Redirection("/backdrop");

  return <div className="w-full h-[100svh]"></div>;
}
