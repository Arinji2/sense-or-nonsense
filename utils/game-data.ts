"use server";

import { FightersList } from "@/app/fighters/fighters";
import { GamesList } from "@/app/games";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GameDataSchema } from "../validations/game-data/schema";
import { GameDataSchemaType } from "../validations/game-data/types";

export async function EncryptGameDataAction({
  key,
  value,
  reset,
  deleteKey,
}: {
  key: string;
  value: string;
  reset?: boolean;
  deleteKey?: boolean;
}) {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
  const cookieStore = cookies();
  const cookieProps = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: true,
    expires: new Date(new Date().getTime() + 604800000),
    path: "/",
  };
  if (reset) {
    const obj = {
      [key]: value,
    };
    const JWT: string = await new SignJWT({
      obj,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("168h")
      .sign(secret);

    cookies().set("game-data", JWT, cookieProps);
    return JWT;
  } else {
    const gameJWT = cookieStore.get("game-data")?.value!;
    const gameData = decodeJwt(gameJWT);

    const parse = GameDataSchema.safeParse(gameData.obj!);
    if (!parse.success) {
      cookieStore.delete("game-data");
      redirect("/");
    }

    let obj = parse.data;

    obj = {
      ...obj,

      [key]: value,
    };

    if (deleteKey) {
      delete obj[key as keyof typeof obj];
    }

    const JWT: string = await new SignJWT({
      obj,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("168h")
      .sign(secret);

    cookies().set("game-data", JWT, cookieProps);
    return JWT;
  }
}
export async function DecryptGameDataAction({ jwt }: { jwt?: string }) {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
  const cookieStore = cookies();
  const gameData = jwt ?? cookieStore.get("game-data")?.value!;

  try {
    const verified = await jwtVerify(gameData, secret, {
      algorithms: ["HS256"],
    });
    if (!verified) {
      cookieStore.delete("game-data");
      redirect("/");
    }
  } catch (e) {
    cookieStore.delete("game-data");
    redirect("/");
  }

  const jwtData = decodeJwt(gameData);

  const parse = GameDataSchema.safeParse(jwtData.obj!);

  if (!parse.success) {
    cookieStore.delete("game-data");
    redirect("/");
  }

  const verified = await ValidateGameDataAction(parse.data);

  if (!verified) {
    cookieStore.delete("game-data");
    redirect("/");
  }

  return parse.data;
}

export async function ValidateGameDataAction(data: GameDataSchemaType) {
  if (data.game_id) {
    const game = GamesList.find(
      (game) => game.id === Number.parseInt(data.game_id!),
    );
    if (!game) {
      return false;
    }
  }

  if (data.fighter_data) {
    data.fighter_data.forEach((player) => {
      const fighterData = FightersList.find(
        (fighter) => fighter.id === Number.parseInt(player.fighter_id),
      );
      if (!fighterData) {
        return false;
      }
    });
  }

  return true;
}
