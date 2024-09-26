import z from "zod";
export const GameFighterSchema = z.object({
  fighter_id: z.number(),
  fighter_name: z.string(),
});

export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
  id: z.string(),
  isFake: z.boolean(),
});
