import z from "zod";
import {
  GameDataSchema,
  GameFighterSchema,
  RoundsSchema,
  WordSchema,
} from "./schema";
export type GameDataSchemaType = z.infer<typeof GameDataSchema>;
export type GameFighterSchemaType = z.infer<typeof GameFighterSchema>;
export type RoundsSchemaType = z.infer<typeof RoundsSchema>;
export type RoundsSchemaTypeWithWords = RoundsSchemaType & {
  word: string;
};
export type WordSchemaType = z.infer<typeof WordSchema>;
