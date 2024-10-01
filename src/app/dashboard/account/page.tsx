import { Button } from "@/components/button";
import Link from "next/link";
import { ExternalAuthModel } from "pocketbase";
import { GetUserMode } from "../../../../utils/getMode";
import { AccountSchema } from "../../../../validations/pb/schema";
import Account from "./account.client";
import LinkOauth from "./link.client";
import Username from "./username.client";

export default async function Page() {
  const { mode, pb, userID } = await GetUserMode();
  let currentUsername = "";
  let existingOauth: ExternalAuthModel[] = [];

  if (mode === "user") {
    const parsedAccount = AccountSchema.safeParse(pb.authStore.model!);
    if (parsedAccount.success) {
      currentUsername = parsedAccount.data.username;
      existingOauth = await pb.collection("users").listExternalAuths(userID!);
    }
  }
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
          {mode !== "user" && <Account />}
          <Username
            isGuest={mode === "guest"}
            currentUsername={currentUsername}
          />
          {existingOauth.length < 3 && (
            <LinkOauth
              isGuest={mode === "guest"}
              existingOauth={existingOauth.map((auth) =>
                auth.provider.toLowerCase(),
              )}
            />
          )}

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
