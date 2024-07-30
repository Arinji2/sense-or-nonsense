import z from "zod";
import { ScoreSchema, ScoresSchema, StoredWordSchema } from "./schema";

export type ScoreSchemaType = z.infer<typeof ScoreSchema>;
export type ScoresSchemaType = z.infer<typeof ScoresSchema>;
export type StoredWordSchemaType = z.infer<typeof StoredWordSchema>;
