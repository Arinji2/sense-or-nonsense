import { StaticImageData } from "next/image";
import { z } from "zod";
import { useAudio } from "../../utils/useAudio";
import { DictonarySchema, SavedSoundSettingsSchema } from "./schema";

export type COOPSupportForFighterSelect = {
  supported: boolean;
  currentPlayer: number;
};
export type BackdropSelected = {
  verified: boolean;
  id: number;
};

export type CurrentStreaks = {
  [key: number]: number;
};

export type SummaryGraphPoints = {
  x: number;
  y: number;

  accuracy: number;
};

export type MaxStreakDataType = {
  value: number;
  round: number;
};

export type SummaryData = {
  correct: number;
  incorrect: number;
  timePlayed: number;
  maxStreak: MaxStreakDataType;
  graphPoints: SummaryGraphPoints[];
  maxAccuracy: number;
  maxTimeLeft: number;
  minTimeLeft: number;
};

export type StringSearchParamType = string | string[] | undefined;
export type SavedSoundSettingsSchemaType = z.infer<
  typeof SavedSoundSettingsSchema
>;
export type AudioHookReturn = ReturnType<typeof useAudio>;

export type DashboardGraphPoints = {
  x: string;
  y: string;
};

export type ReferencePoints = {
  value: number;
  key: string;
};

export type FighterDataType = {
  id: number;
  name: string;
  image: StaticImageData;
  transparentImage: StaticImageData;
  color: string;

  lore: {
    short: string;
    long: string;
  };
};

export type BackdropDataType = {
  id: number;
  name: string;
  image: StaticImageData;
};

export type GamesDataType = {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
  showLeft: boolean;
  isMultiplayer: boolean;
  showTime: boolean;
};

export type DictionarySchemaType = z.infer<typeof DictonarySchema>;
