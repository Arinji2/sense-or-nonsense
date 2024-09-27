import z from "zod";

export const SavedSoundSettingsSchema = z.object({
  volume: z.number().min(0).max(1),
  isEnabled: z.boolean(),
});
