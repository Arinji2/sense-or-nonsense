import z from "zod";
import { GameFighterSchemaType, RoundsSchemaType } from "./types";
export const GameFighterSchema = z.object({
  fighter_id: z.string(),
  fighter_name: z.string(),
});

export const RoundsSchema = z.object({
  round: z.number(),
  playerIndex: z.number(),
  recordID: z.string(),
  isCorrect: z.boolean(),
  timeElapsed: z.number(),
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
  game: z
    .string()
    .or(z.array(RoundsSchema))
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        return JSON.parse(val) as GameFighterSchemaType[];
      } else if (Array.isArray(val)) {
        return val as RoundsSchemaType[];
      }
    }),
});

export const WordSchema = z.object({
  word: z.string(),
  definition: z.string(),
  id: z.string(),
  difficulty: z.string(),
  isFake: z.boolean(),
});
