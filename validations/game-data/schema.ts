import z from "zod";
import { GameFighterSchemaType } from "./types";
export const GameFighterSchema = z.object({
  fighter_id: z.string(),
  fighter_name: z.string(),
});

export const GameDataSchema = z.object({
  game_id: z
    .string()

    .optional()
    .transform((val) => {
      if (!val) return undefined;

      return val;
    }),

  fighter_data: z
    .string()
    .or(z.array(GameFighterSchema))
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        return JSON.parse(val) as GameFighterSchemaType[];
      } else if (Array.isArray(val)) {
        return val as GameFighterSchemaType[];
      }
    }),
  difficulty: z.string().optional(),
  backdrop: z.string().optional(),
});
