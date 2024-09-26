import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { default as Pocketbase } from "pocketbase";
import { CACHED_TAGS } from "../constants/tags";

export async function ConnectPBAdmin() {
  const email = process.env.PB_EMAIL!;
  const password = process.env.PB_PASSWORD!;

  const cachedTokenData = await unstable_cache(
    async (email: string, password: string) => {
      const pb = new Pocketbase("https://db-word.arinji.com/");
      await pb.admins.authWithPassword(email, password);
      const token = await pb.admins.authRefresh();
      return token;
    },
    [],
    {
      revalidate: 60 * 2, // 2 minutes
      tags: [CACHED_TAGS.guest_client],
    },
  )(email, password);

  const pb = new Pocketbase("https://db-word.arinji.com");
  pb.authStore.save(cachedTokenData.token, cachedTokenData.admin);
  return pb;
}

export async function ConnectPBUser() {
  const userCookie = cookies().get("user");

  if (!userCookie || !userCookie.value) {
    throw new Error("User not logged in");
  }

  const cachedTokenData = await unstable_cache(
    async (cookie: string) => {
      const pb = new Pocketbase("https://db-word.arinji.com/");
      pb.authStore.loadFromCookie(cookie);
      const token = await pb.collection("users").authRefresh();

      return token;
    },
    [],
    {
      revalidate: 60 * 2, // 2 minutes
      tags: [CACHED_TAGS.user_client],
    },
  )(userCookie.value);

  if (!cachedTokenData) throw new Error("User not logged in");
  const pb = new Pocketbase("https://db-word.arinji.com");
  pb.authStore.save(cachedTokenData.token, cachedTokenData.record);

  return {
    pb,
    userID: pb.authStore.model!.id as string,
  };
}
