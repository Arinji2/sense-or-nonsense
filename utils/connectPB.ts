import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { memoize } from "nextjs-better-unstable-cache";
import {
  default as Pocketbase,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { CACHED_TAGS } from "../constants/tags";

export async function ConnectPBAdmin() {
  const email = process.env.PB_EMAIL!;
  const password = process.env.PB_PASSWORD!;

  const cachedTokenData = await memoize(
    async (email: string, password: string) => {
      const pb = new Pocketbase("https://db-word.arinji.com/");
      await pb.collection("_superusers").authWithPassword(email, password);
      const token = await pb.collection("_superusers").authRefresh();
      return token;
    },
    {
      duration: 60 * 2, // 2 minutes
      revalidateTags: [CACHED_TAGS.guest_client],
    },
  )(email, password);

  const pb = new Pocketbase("https://db-word.arinji.com");
  pb.authStore.save(cachedTokenData.token, cachedTokenData.record);
  return pb;
}

export async function ConnectPBUser() {
  const userCookie = cookies().get("user");

  if (!userCookie || !userCookie.value) {
    throw new Error("User not logged in");
  }

  const cachedTokenData = await memoize(
    async (token: string) => {
      const pb = new Pocketbase("https://db-word.arinji.com/");
      pb.authStore.save(token);
      let authData: RecordAuthResponse<RecordModel>;

      try {
        authData = await pb.collection("users").authRefresh();
      } catch (error) {
        redirect("/");
      }

      return authData;
    },

    {
      duration: 60 * 2, // 2 minutes
      revalidateTags: [CACHED_TAGS.user_client],
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
