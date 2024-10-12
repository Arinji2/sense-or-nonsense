import { Info } from "lucide-react";
import { memoize } from "nextjs-better-unstable-cache";
import { CACHED_TAGS } from "../../../constants/tags";
import { ConnectPBAdmin } from "../../../utils/connectPB";
import { GetUserMode } from "../../../utils/getMode";
import { RoundsSchema } from "../../../validations/pb/schema";
import Modal from "./leaderboard.client";

export default async function Leaderboard() {
  const { userID, mode } = await GetUserMode();
  const finalData = await memoize(
    async () => {
      const pb = await ConnectPBAdmin();
      const rounds = await pb.collection("rounds").getFullList({
        expand: "game,game.user",
      });

      const parsedRounds = RoundsSchema.parse(rounds);
      const gameScores = new Map<
        string,
        { score: number; game: any; user: any }
      >();

      for (const round of parsedRounds) {
        if (
          !round.correct ||
          !round.expand?.game ||
          !round.expand.game.completed
        )
          continue;

        const { id, difficulty, expand } = round.expand.game;
        if (!gameScores.has(id)) {
          gameScores.set(id, {
            score: 0,
            game: round.expand.game,
            user: expand?.user,
          });
        }

        const gameData = gameScores.get(id)!;
        gameData.score +=
          difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
      }

      const finalData = [...gameScores.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ score, game, user }) => ({
          username: user?.username as string,
          user: user?.id as string,
          score,
        }));

      return finalData;
    },
    {
      revalidateTags: [CACHED_TAGS.leaderboard],
    },
  )();

  return (
    <>
      <Modal show={true} />
      <div className="z-10 flex h-fit w-full flex-col items-center justify-start bg-neutral-900 py-10">
        <div className="flex h-full w-full max-w-full-page flex-col items-center justify-start gap-8 px-4 xl:w-[80%] xl:px-0">
          <div className="flex h-fit w-full flex-col items-center justify-start gap-10">
            <h2 className="text-center text-xl font-bold tracking-title text-green-500 md:text-3xl xl:text-5xl">
              LEADERBOARD
            </h2>
            <div className="flex h-fit w-fit flex-col items-center justify-start gap-8 rounded-md bg-orange-500/10 p-4 xl:w-[400px]">
              <p className="text-center text-base font-bold text-white md:text-xl xl:text-xl">
                SCORE CALCULATION
              </p>
              <div className="flex h-fit w-fit flex-col items-center justify-start gap-2">
                <p className="text-xss text-white/70 md:text-xs xl:text-sm">
                  Easy Rounds: 1*Rounds
                </p>
                <p className="text-xss text-white/70 md:text-xs xl:text-sm">
                  Medium Rounds: 2*Rounds
                </p>
                <p className="text-xss text-white/70 md:text-xs xl:text-sm">
                  Hard Rounds: 3*Rounds
                </p>
              </div>
            </div>

            <div className="h-fit w-full overflow-x-auto overflow-y-hidden py-10">
              <table className="w-full min-w-[300px] border-separate border-spacing-5">
                <thead>
                  <tr>
                    <th className="min-w-[50px] border-b-2 border-white/40 pb-2 text-green-500">
                      Rank
                    </th>
                    <th className="min-w-[100px] border-b-2 border-white/40 pb-2 text-purple-500">
                      Username
                    </th>
                    <th className="min-w-[50px] border-b-2 border-white/40 pb-2 text-blue-500">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {finalData.map(({ username, score, user }, index) => (
                    <tr key={index}>
                      <td className="min-w-[50px] border-x-2 border-white/40 p-2 px-4 text-center text-white">
                        {index + 1}
                      </td>
                      <td className="relative flex min-w-[100px] flex-col items-center justify-center border-x-2 border-white/40 p-2 px-16 text-white md:px-4">
                        <div className="relative h-fit w-fit whitespace-nowrap text-center">
                          {username}
                          {mode === "guest" && userID && userID === user && (
                            <div className="group relative inline-block">
                              <Info className="ml-2 size-4 cursor-pointer text-yellow-500" />
                              <div className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-20 w-[200px] whitespace-normal break-words rounded-md bg-[#2C2828] p-2 text-left text-xss text-white/60 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 md:w-[400px] md:text-xs">
                                This is you!! For a custom username convert your
                                account in the Dashboard!
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="min-w-[50px] border-x-2 border-white/40 p-2 px-4 text-center text-white">
                        {score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
