import z from "zod";
import { GameFighterSchema, WordSchema } from "./schema";
export type GameFighterSchemaType = z.infer<typeof GameFighterSchema>;
export type WordSchemaType = z.infer<typeof WordSchema>;
