import z from "zod";
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
