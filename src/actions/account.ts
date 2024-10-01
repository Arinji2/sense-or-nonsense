"use server";
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import Pocketbase from "pocketbase";
import { ConnectPBAdmin } from "../../utils/connectPB";
export async function AddAccountCookie(token: string) {
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
  } catch (error) {
    console.log(error);
  }
}

export async function ConvertAccount() {
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
    console.error(error);
    throw new Error("Convert Account Failed");
  }
}
