import z from "zod";
import { ScoreSchema, ScoresSchema } from "./schema";

export type ScoreSchemaType = z.infer<typeof ScoreSchema>;
export type ScoresSchemaType = z.infer<typeof ScoresSchema>;
