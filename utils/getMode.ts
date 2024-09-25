import { GuestToUser } from "@/actions/guest";

import { cookies } from "next/headers";
import Client from "pocketbase";
import { ConnectPBAdmin, ConnectPBUser } from "./connectPB";

export async function GetUserMode() {
  const cookieStore = cookies();
  let globalUserID: string | null = null;
  let mode: "guest" | "user" | null = null;
  let pb: Client | null = null;
  if (cookieStore.get("user") !== undefined) {
    const pbUser = await ConnectPBUser();
    if (pbUser.pb.authStore.isValid) {
      globalUserID = pbUser.pb.authStore.model!.id as string;
      mode = "user";
      pb = pbUser.pb;
    }
  } else if (cookieStore.get("guest-session") !== undefined) {
    const { userID, guestID } = await GuestToUser();
    globalUserID = userID;
    mode = "guest";
    pb = await ConnectPBAdmin();
  }

  if (!mode) {
    return {
      userID: null,
      mode: null,
      pb: null,
    };
  }

  if (!pb) {
    throw new Error("User not logged in");
  }

  pb.autoCancellation(false);

  return {
    userID: globalUserID,
    mode,
    pb,
  };
}
