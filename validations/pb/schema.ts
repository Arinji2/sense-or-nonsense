import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  default_avatar: z.string(),
  default_backdrop: z.string(),
  guest_data: z.string(),
});

export const StoredWordSchema = z.object({
  level: z.number(),
  word: z.string(),
  definition: z.string(),

  created: z.string().transform((val) => new Date(val)),
  id: z.string(),
});

export const RoundSchema = z
  .object({
    id: z.string(),
    correct: z.boolean(),
    is_fake: z.boolean(),
    fake_word: z.string().optional(),
    real_word: z.string().optional(),
    expand: z.optional(
      z.object({
        fake_word: StoredWordSchema.optional(),
        real_word: StoredWordSchema.optional(),
      }),
    ),
    created: z.string().transform((val) => new Date(val)),
    updated: z.string().transform((val) => new Date(val)),
  })
  .refine(
    (data) => !data.is_fake || (data.fake_word && data.fake_word.trim() !== ""),
    {
      message: "fake_word must exist and not be empty if isFake is true",
      path: ["fake_word"],
    },
  )
  .refine(
    (data) => data.is_fake || (data.real_word && data.real_word.trim() !== ""),
    {
      message: "real_word must exist and not be empty if isFake is false",
      path: ["real_word"],
    },
  );

export const GameSchema = z.object({
  id: z.string(),
  user: z.string(),
  rounds: z.array(z.string()),
  gameID: z.string(),
  difficulty: z.string(),
  backdrop: z.string(),
  playerData: z.string().transform((val) => {
    if (!val.includes(":")) {
      return false;
    }
    const [playerID, playerName] = val.split(":");
    return {
      playerID,
      playerName,
    };
  }),
  expand: z.optional(
    z.object({
      rounds: z.array(RoundSchema),
    }),
  ),
  created: z.string().transform((val) => new Date(val)),
  updated: z.string().transform((val) => new Date(val)),
});
