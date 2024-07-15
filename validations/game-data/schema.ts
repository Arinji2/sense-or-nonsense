import z from "zod";
export const GameFighterSchema = z.object({
  fighter_id: z.string().transform((val) => Number.parseInt(val)),
  fighter_name: z.string(),
});

export const GameDataSchema = z.object({
  game_id: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Number.parseInt(val);
    }),
  fighter_data: z.array(GameFighterSchema).optional(),
});
