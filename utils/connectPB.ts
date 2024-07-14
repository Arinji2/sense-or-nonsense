import { cookies } from "next/headers";
import Pocketbase from "pocketbase";
import "server-only";

export async function ConnectPBAdmin() {
  const email = process.env.PB_EMAIL!;
  const password = process.env.PB_PASSWORD!;

  const pb = new Pocketbase("https://db-word.arinji.com/");
  await pb.admins.authWithPassword(email, password);
  await pb.admins.authRefresh();
  return pb;
}

export async function ConnectPBUser() {
  const userCookie = cookies().get("user");
  if (!userCookie || !userCookie.value) {
    throw new Error("User not logged in");
  }
  const pb = new Pocketbase("https://db-word.arinji.com/");
  pb.authStore.loadFromCookie(userCookie.value);
  await pb.collection("users").authRefresh();
  return pb;
}
