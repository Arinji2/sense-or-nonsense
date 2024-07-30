import z from "zod";
import { GameDataSchemaWithWords } from "../game-data/schema";
export const ScoreSchema = z.object({
  id: z.string(),
  easy: z.number(),
  medium: z.number(),
  hard: z.number(),
  user: z.string(),
  game_id: z.number(),
  created: z.string().transform((d) => new Date(d)),
  updated: z.string().transform((d) => new Date(d)),
});

export const ScoresSchema = z.array(ScoreSchema);

export const StoredWordSchema = z.object({
  level: z.number(),
  word: z.string(),
  definition: z.string(),

  created: z.string().transform((val) => new Date(val)),
  id: z.string(),
});

export const StoredGameSchema = z.object({
  id: z.string(),
  data: GameDataSchemaWithWords,
  user: z.string(),
});
