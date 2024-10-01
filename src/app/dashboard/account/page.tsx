import Link from "next/link";
import { ExternalAuthModel } from "pocketbase";
import { GetUserMode } from "../../../../utils/getMode";
import { AccountSchema } from "../../../../validations/pb/schema";
import Account from "./account.client";
import Delete from "./delete.client";
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

          <Delete />
        </div>
      </div>
    </div>
  );
}
