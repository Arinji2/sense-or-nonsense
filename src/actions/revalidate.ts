"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHED_TAGS } from "../../constants/tags";

const ALLOWEDTAGS = [CACHED_TAGS.game_data, CACHED_TAGS.user_games];

export async function RevalidateAction(mode: "tag" | "path", path: string) {
  if (mode === "path") {
    revalidatePath(path);
  } else {
    if (!ALLOWEDTAGS.includes(path.split("-")[0])) {
      throw new Error("Tag not allowed");
    }

    revalidateTag(path);
  }
}
