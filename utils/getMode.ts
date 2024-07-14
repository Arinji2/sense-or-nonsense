import { GuestToUser } from "@/actions/guest";
import { cookies } from "next/headers";
import { ConnectPBUser } from "./connectPB";

export async function GetUserMode() {
  const cookieStore = cookies();
  let userID: string | null = null;
  let mode: "guest" | "user" | null = null;
  if (cookieStore.get("user") !== undefined) {
    const pbUser = await ConnectPBUser();
    if (pbUser.authStore.isValid) {
      userID = pbUser.authStore.model!.id as string;
      mode = "user";
    }
  } else if (cookieStore.get("guest-session") !== undefined) {
    const id = await GuestToUser();
    userID = id;
    mode = "guest";
  }

  return { userID, mode };
}
