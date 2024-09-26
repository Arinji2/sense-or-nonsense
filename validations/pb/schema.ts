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

export const RoundSchema = z.object({
  id: z.string(),
  correct: z.boolean(),
  is_fake: z.boolean(),
  fake_word: z.string().optional(),
  real_word: z.string().optional(),
  round_number: z.number(),
  player_index: z.number(),
  time_elapsed: z.number(),
  expand: z.optional(
    z.object({
      fake_word: StoredWordSchema.optional(),
      real_word: StoredWordSchema.optional(),
    }),
  ),
  created: z.string().transform((val) => new Date(val)),
  updated: z.string().transform((val) => new Date(val)),
});

export const GameSchema = z
  .object({
    id: z.string(),
    user: z.string(),
    rounds: z.array(z.string()),
    gameID: z.string(),
    difficulty: z.string(),
    backdrop: z.string(),
    playerData: z.string().transform((val) => {
      if (!val.includes(":")) {
        return [];
      }

      const players = val.split(";").map((entry) => {
        const [fighter_id, fighter_name] = entry.split(":");

        if (!fighter_id || !fighter_name) {
          return null;
        }

        return {
          fighter_id: Number(fighter_id),
          fighter_name,
        };
      });

      // Filter out any null entries (in case of bad input)
      return players.filter((player) => player !== null);
    }),
    expand: z.optional(
      z.object({
        rounds: z.array(RoundSchema),
      }),
    ),
    created: z.string().transform((val) => new Date(val)),
    updated: z.string().transform((val) => new Date(val)),
  })
  .transform((val) => {
    if (!val.gameID || !val.difficulty || !val.backdrop || !val.playerData) {
      return {
        ...val,
        isValidated: false,
      };
    } else {
      return {
        ...val,
        isValidated: true,
      };
    }
  });
