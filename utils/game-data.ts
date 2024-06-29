"use server";

import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function EncryptGameDataAction({
  key,
  value,
  reset,
}: {
  key: string;
  value: string;
  reset?: boolean;
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
    const gameData = cookieStore.get("game-data")?.value!;
    const obj = {
      ...JSON.parse(gameData),
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
  }
}
export async function DecryptGameDataAction() {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
  const cookieStore = cookies();
  const gameData = cookieStore.get("game-data")?.value!;

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
  return jwtData.obj!;
}
