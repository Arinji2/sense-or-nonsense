import z from "zod";
import { GameSchema, RoundSchema, StoredWordSchema } from "./schema";

export type StoredWordSchemaType = z.infer<typeof StoredWordSchema>;
export type GameSchemaType = z.infer<typeof GameSchema>;
export type RoundSchemaType = z.infer<typeof RoundSchema>;
