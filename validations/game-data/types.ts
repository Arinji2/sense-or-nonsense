import z from "zod";
import { GameDataSchema, GameFighterSchema } from "./schema";
export type GameDataSchemaType = z.infer<typeof GameDataSchema>;
export type GameFighterSchemaType = z.infer<typeof GameFighterSchema>;
