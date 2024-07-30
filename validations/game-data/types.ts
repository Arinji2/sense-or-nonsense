import z from "zod";
import {
  GameDataSchema,
  GameDataSchemaWithWords,
  GameFighterSchema,
  RoundsSchema,
  RoundsSchemaWithWords,
  WordSchema,
} from "./schema";
export type GameDataSchemaType = z.infer<typeof GameDataSchema>;
export type GameFighterSchemaType = z.infer<typeof GameFighterSchema>;
export type RoundsSchemaType = z.infer<typeof RoundsSchema>;
export type RoundsSchemaTypeWithWords = z.infer<typeof RoundsSchemaWithWords>;
export type GameDataSchemaTypeWithWords = z.infer<
  typeof GameDataSchemaWithWords
>;
export type WordSchemaType = z.infer<typeof WordSchema>;
