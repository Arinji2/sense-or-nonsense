"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { memoize } from "nextjs-better-unstable-cache";
import { ConnectPBAdmin } from "../../utils/connectPB";

export async function InitGuest(newSessionID?: number) {
  const pbAdmin = await ConnectPBAdmin();
  //Random number of 8 digits
  const sessionID =
    newSessionID ?? Math.floor(10000000 + Math.random() * 90000000);
  try {
    await pbAdmin
      .collection("guests")
      .getFirstListItem(`session_id="${sessionID}"`);
    const failedID = Math.floor(10000000 + Math.random() * 90000000);
    return await InitGuest(failedID);
  } catch (e) {
    const guestRecord = await pbAdmin.collection("guests").create({
      session_id: sessionID,
    });
    //Random number of 8 digits
    const password = Math.floor(10000000 + Math.random() * 90000000);
    await pbAdmin.collection("users").create({
      username: `Guest-${sessionID}`,

      guest_data: guestRecord.id,
      password: password,
      passwordConfirm: password,
    });
    cookies().set("guest-session", sessionID.toString(), {
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      //expires in 10 years
      maxAge: 60 * 60 * 24 * 365 * 10,
    });
  }
}

export async function GuestToUser() {
  const pbAdmin = await ConnectPBAdmin();
  const sessionID = cookies().get("guest-session");
  if (!sessionID) {
    throw new Error("No guest session found");
  }
  try {
    const { guestID, userID } = await memoize(
      async (sessionID: string) => {
        const record = await pbAdmin
          .collection("guests")
          .getFirstListItem(`session_id="${sessionID}"`);

        const data = await pbAdmin
          .collection("users")
          .getFirstListItem(`guest_data="${record.id}"`);

        return {
          userID: data.id,
          guestID: record.id,
        };
      },
      {
        duration: 60 * 5, // 5 minutes
      },
    )(sessionID.value);

    return {
      userID: userID,
      guestID: guestID,
    };
  } catch (e) {
    if (process.env.MODE === "development") {
      throw new Error("Guest record not found");
    }
    redirect("/error?code=0");
  }
}
