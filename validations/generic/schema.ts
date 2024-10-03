import z from "zod";
import { REGEX } from "../../constants/regex";

export const SavedSoundSettingsSchema = z.object({
  volume: z.number().min(0).max(1),
  isEnabled: z.boolean(),
});

export const FighterNameSchema = z
  .string()
  .max(15, "Name can't be longer than 15 characters")
  .regex(REGEX.fighterName, "Name can only contain numbers and letters.")
  .refine((name) => {
    if (name.toLowerCase().includes("CPU")) return false;
    return true;
  });

/*
  
  [
    {
      "word": "hello",
      "meanings": [
        {
          "partOfSpeech": "exclamation",
          "definitions": [
            {
              "definition": "used as a greeting or to begin a phone conversation.",
              "example": "hello there, Katie!",
            }
          ]
        },
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "an utterance of ‘hello’; a greeting.",
              "example": "she was getting polite nods and hellos from people",
            }
          ]
        },
        {
          "partOfSpeech": "verb",
          "definitions": [
            {
              "definition": "say or shout ‘hello’.",
              "example": "I pressed the phone button and helloed",
            }
          ]
        }
      ]
    }
  ]

  */

export const DictonarySchema = z.object({
  word: z.string(),
  meanings: z.array(
    z.object({
      partOfSpeech: z.string(),
      definitions: z.array(
        z
          .object({
            definition: z.string(),
            example: z.string().optional(),
          })
          .optional(),
      ),
    }),
  ),
});
