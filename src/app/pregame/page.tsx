import { DecryptGameDataAction } from "../../../utils/game-data";

export default async function Page() {
  const data = await DecryptGameDataAction();
  console.log(data);

  return <div className="w-full h-[100svh]"></div>;
}
