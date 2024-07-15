import z from "zod";
import { GameDataSchema } from "./schema";
export type GameDataSchemaType = z.infer<typeof GameDataSchema>;
