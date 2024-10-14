"use server";
import { revalidateTag, unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import Pocketbase, { ClientResponseError } from "pocketbase";
import { CACHED_TAGS } from "../../constants/tags";
import { ConnectPBAdmin } from "../../utils/connectPB";
import { GetUserMode } from "../../utils/getMode";
import { UsernameSchema } from "../../validations/pb/schema";
export async function AddAccountCookieAction(token: string) {
  const pb = new Pocketbase("https://db-word.arinji.com/");
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();
  if (!pb.authStore.token) throw new Error("Token not found");
  try {
    const cookieString = pb.authStore.exportToCookie();
    cookies().set("user", pb.authStore.token, {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      // 7 days
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    });
  } catch (error) {}
}

export async function ConvertAccountAction() {
  unstable_noStore();
  const guestID = cookies().get("guest-session")?.value;
  const userToken = cookies().get("user")?.value;

  if (!guestID || !userToken) {
    throw new Error("No cookies found");
  }
  try {
    const pb = new Pocketbase("https://db-word.arinji.com/");
    pb.authStore.save(userToken);
    await pb.collection("users").authRefresh();

    if (!pb.authStore.token) throw new Error("Token not found");

    const guestData = await pb
      .collection("guests")
      .getFirstListItem(`session_id = "${guestID}"`);

    const adminPB = await ConnectPBAdmin();

    const guestUserData = await adminPB
      .collection("users")
      .getFirstListItem(`guest_data="${guestData.id}"`);

    const userGames = await adminPB.collection("games").getFullList({
      filter: `user="${guestUserData.id}"`,
      sort: "-created",
    });
    await Promise.all(
      userGames.map(async (game) => {
        await adminPB.collection("games").update(game.id, {
          user: pb.authStore.model!.id,
        });
      }),
    );

    await adminPB.collection("users").delete(guestUserData.id);
    await adminPB.collection("guests").delete(guestData.id);

    cookies().delete("guest-session");
  } catch (error) {
    throw new Error("Convert Account Failed");
  }
}

async function CheckUsernameExists(username: string) {
  try {
    const { userID, mode, pb } = await GetUserMode();
    if (mode !== "user") throw new Error("User not logged in");

    UsernameSchema.parse(username);
    if (username.length === 0) throw new Error("Username can't be empty");

    try {
      await pb.collection("users").getFirstListItem(`username="${username}"`);
      return true;
    } catch (error) {
      return false;
    }
  } catch (error) {
    return true;
  }
}
export async function UpdateUsernameAction(username: string) {
  try {
    const { userID, mode, pb } = await GetUserMode();
    if (mode !== "user") throw new Error("User not logged in");

    UsernameSchema.parse(username);
    if (username.length === 0) throw new Error("Username can't be empty");

    const usernameExists = await CheckUsernameExists(username);

    if (usernameExists) throw new Error("Username already exists");

    await pb.collection("users").update(userID!, {
      username,
    });

    revalidateTag(CACHED_TAGS.user_client);
    revalidateTag(CACHED_TAGS.leaderboard);
  } catch (error) {
    if (error instanceof ClientResponseError) {
      if (
        error.response.message ===
        "Something went wrong while processing your request."
      ) {
        throw new Error("Username already exists");
      }
    }
    if (error instanceof Error && error.message === "Username already exists") {
      throw new Error("Username already exists");
    } else throw new Error("Update Username Failed");
  }
}

export async function DeleteAccountAction() {
  unstable_noStore();
  const { mode, pb, userID } = await GetUserMode();
  try {
    if (mode === "user") {
      await pb.collection("users").delete(userID!);
    } else if (mode === "guest") {
      const guestID = cookies().get("guest-session")?.value;
      const guestData = await pb
        .collection("guests")
        .getFirstListItem(`session_id = "${guestID}"`);
      const pbAdmin = await ConnectPBAdmin();

      const guestUserData = await pbAdmin
        .collection("users")
        .getFirstListItem(`guest_data="${guestData.id}"`);
      await pbAdmin.collection("users").delete(guestUserData.id);
      await pbAdmin.collection("guests").delete(guestData.id);
    }

    cookies().delete("user");
    cookies().delete("guest-session");

    revalidateTag(`${CACHED_TAGS.user_client}`);
  } catch (error) {
    throw new Error("Delete Account Failed");
  }
}
