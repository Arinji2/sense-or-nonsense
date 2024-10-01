import { Button } from "@/components/button";
import Link from "next/link";
import { cn } from "../../../../utils/cn";
import { GetUserMode } from "../../../../utils/getMode";

export default async function Page() {
  const { mode, pb, userID } = await GetUserMode();
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E] xl:h-[100svh] xl:min-h-1">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-10 px-4 xl:px-0 xl:py-10"
      >
        <h1 className="text-base font-bold leading-relaxed tracking-title text-white md:text-xl">
          <Link
            href="/dashboard"
            className="block text-white/50 md:inline xl:text-lg"
          >
            DASHBOARD
          </Link>
          /ACCOUNT
        </h1>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="flex h-full w-full flex-col items-center justify-start gap-10"
        >
          <div className="flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-blue-500/20 p-4 md:h-[200px] md:flex-row">
            <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
              <h3 className="text-lg font-bold text-white md:text-xl xl:text-2xl">
                CONVERT ACCOUNT
              </h3>
            </div>
            <div className="h-[80%] w-[2px] bg-white/20"></div>
            <div className="flex h-full w-fit flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
              <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
                <p className="text-center text-xss font-bold text-white md:text-left">
                  By converting,{" "}
                  <span className="inline md:block">
                    {" "}
                    you get the following benefits.
                  </span>
                </p>
                <div className="flex h-fit w-full flex-col items-center justify-center md:w-fit">
                  <ul className="flex h-fit w-fit flex-col items-start justify-start gap-2 text-white/50">
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Secure your Account
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Login anywhere
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Set a username
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Set defaults
                    </li>
                  </ul>
                </div>
              </div>
              <Button className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto md:w-fit xl:w-[120px] xl:py-2">
                <p className="text-xs font-bold text-white md:text-xs">
                  CONVERT
                </p>
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-green-500/20 p-4 md:h-[200px] md:flex-row",
              {
                "cursor-not-allowed opacity-20": mode === "guest",
              },
            )}
          >
            <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
              <h3 className="text-lg font-bold text-white md:text-xl xl:text-2xl">
                EDIT USERNAME
              </h3>
            </div>
            <div className="h-[80%] w-[2px] bg-white/20"></div>
            <div className="flex h-fit w-full flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
              <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
                <p className="text-center text-xss font-bold text-white md:text-left">
                  Edit your username
                </p>

                <input
                  type="text"
                  disabled={mode === "guest"}
                  className="h-fit w-full shrink rounded-sm bg-white/10 px-3 py-2 text-sm text-white md:w-fit md:py-1.5 md:text-base xl:py-2.5"
                />
              </div>
              <Button className="h-fit w-full shrink-0 rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto xl:w-[120px] xl:py-2">
                <p className="text-xs font-bold text-white md:text-xs">SAVE</p>
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-yellow-500/20 p-4 md:h-[200px] md:flex-row",
              {
                "cursor-not-allowed opacity-20": mode === "guest",
              },
            )}
          >
            <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
              <h3 className="text-center text-lg font-bold text-white md:text-left md:text-xl xl:text-2xl">
                LOGIN WITH OTHER PROVIDER
              </h3>
            </div>
            <div className="h-[80%] w-[2px] bg-white/20"></div>
            <div className="flex h-fit w-full flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
              <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
                <p className="text-center text-xss font-bold text-white md:text-left">
                  Available Providrs
                </p>

                <div className="flex h-fit w-full flex-col items-center justify-center md:w-fit">
                  <ul className="flex h-fit w-fit flex-col items-start justify-start gap-2 text-white/50">
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Google
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Discord
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Github
                    </li>
                  </ul>
                </div>
              </div>
              <Button className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto md:w-fit xl:w-[120px] xl:py-2">
                <p className="text-xs font-bold text-white md:text-xs">
                  CONVERT
                </p>
              </Button>
            </div>
          </div>
          <div className="flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-orange-500/20 p-4 md:h-[200px] md:flex-row">
            <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
              <h3 className="text-left text-lg font-bold text-white md:text-xl xl:text-2xl">
                DELETE ACCOUNT
              </h3>
            </div>
            <div className="h-[80%] w-[2px] bg-white/20"></div>
            <div className="flex h-fit w-full flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
              <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
                <p className="text-center text-xss font-bold text-white md:text-left">
                  After deleting your account,{" "}
                  <span className="inline md:block">
                    you will lose the following data.
                  </span>
                </p>

                <div className="flex h-fit w-full flex-col items-center justify-center md:w-fit">
                  <ul className="flex h-fit w-fit flex-col items-start justify-start gap-2 text-white/50">
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      All Games
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      All Rounds
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Highscores
                    </li>
                    <li className="flex flex-row items-center justify-start gap-2 text-xss">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Account Settings
                    </li>
                  </ul>
                </div>
              </div>
              <Button className="h-fit w-full rounded-sm bg-red-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto xl:w-[120px] xl:py-2">
                <p className="text-xs font-bold text-white md:text-xs">
                  DELETE
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
