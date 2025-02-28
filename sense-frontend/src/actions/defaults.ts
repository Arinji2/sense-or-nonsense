"use server";

import { BackdropsList } from "@/app/backdrop/backdrops";
import { revalidateTag } from "next/cache";
import { FightersList } from "../../constants/fighters";
import { CACHED_TAGS } from "../../constants/tags";
import { GetUserMode } from "../../utils/getMode";
import { StringifiedGameFighterSchema } from "../../validations/game-data/schema";
import { GameFighterSchemaType } from "../../validations/game-data/types";
import { AccountSchema } from "../../validations/pb/schema";
import { AddBackdropAction } from "./game/backdrop";
import { AddFighterAction } from "./game/fighters";

export async function SetDefaultFighterAction(
  fighterData: GameFighterSchemaType,
) {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");
    const isVerfified = FightersList.find(
      (fighter) => fighter.id === fighterData.fighter_id,
    );
    if (!isVerfified) throw new Error("Invalid fighter");
    const uid = Math.floor(Math.random() * 100000);
    const fighterString = `${uid}:${fighterData.fighter_id}:${fighterData.fighter_name}`;
    await pb.collection("users").update(userID!, {
      default_fighter: fighterString,
    });
    revalidateTag(`${CACHED_TAGS.user_client}`);
  } catch (e) {
    throw new Error("Failed to set default fighter");
  }
}

export async function CheckDefaultFighterAction() {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");

    const parsedAccount = AccountSchema.parse(pb.authStore.model);
    if (parsedAccount.default_fighter === "")
      throw new Error("No default fighter set");
    const { fighter_uid, fighter_id, fighter_name } =
      StringifiedGameFighterSchema.parse(parsedAccount.default_fighter);

    if (
      fighter_uid === undefined ||
      fighter_id === undefined ||
      fighter_name === undefined
    )
      throw new Error("Invalid fighter");

    if (FightersList.find((fighter) => fighter.id === fighter_id) === undefined)
      throw new Error("Invalid fighter");

    const fighterData = {
      fighter_uid,
      fighter_id,
      fighter_name,
    } as GameFighterSchemaType;

    await AddFighterAction(fighterData);
    return true;
  } catch (e) {
    return false;
  }
}

export async function DeleteDefaultFighterAction() {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");

    await pb.collection("users").update(userID!, {
      default_fighter: "",
    });

    revalidateTag(`${CACHED_TAGS.user_client}`);
  } catch (e) {
    return false;
  }
}
export async function SetDefaultBackdropAction(backdropID: number) {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");

    await pb.collection("users").update(userID!, {
      default_backdrop: backdropID,
    });

    revalidateTag(`${CACHED_TAGS.user_client}`);
  } catch (e) {
    throw new Error("Failed to set default backdrop");
  }
}

export async function CheckDefaultBackdropAction() {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");

    const parsedAccount = AccountSchema.parse(pb.authStore.model);

    if (parsedAccount.default_backdrop === 0)
      throw new Error("No default backdrop set");
    const backdropID = Number(parsedAccount.default_backdrop);
    if (
      BackdropsList.find((backdrop) => backdrop.id === backdropID) === undefined
    )
      throw new Error("Invalid backdrop");

    await AddBackdropAction(backdropID);
    return true;
  } catch (e) {
    return false;
  }
}

export async function DeleteDefaultBackdropAction() {
  try {
    const { pb, userID, mode } = await GetUserMode();

    if (mode !== "user") throw new Error("Invalid mode");

    await pb.collection("users").update(userID!, {
      default_backdrop: 0,
    });

    revalidateTag(`${CACHED_TAGS.user_client}`);
  } catch (e) {
    return false;
  }
}
