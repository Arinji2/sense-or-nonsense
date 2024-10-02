import z from "zod";
export const GameFighterSchema = z.object({
  fighter_uid: z.number(),
  fighter_id: z.number(),
  fighter_name: z.string(),
});

export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
  id: z.string(),
  isFake: z.boolean(),
});

export const StringifiedGameFighterSchema = z.string().transform((val) => {
  const [uid, fighterID, fighterName] = val.split(":");
  return {
    fighter_uid: Number(uid),
    fighter_id: Number(fighterID),
    fighter_name: fighterName,
  };
});
