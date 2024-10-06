import Link from "next/link";
import { redirect } from "next/navigation";
import { memoize } from "nextjs-better-unstable-cache";
import { CACHED_TAGS } from "../../../../../constants/tags";
import { FormatDate1, NameFormat } from "../../../../../utils/formatting";
import { GetUserMode } from "../../../../../utils/getMode";
import { DictonarySchema } from "../../../../../validations/generic/schema";
import { DictionarySchemaType } from "../../../../../validations/generic/types";
import {
  RoundSchema,
  StoredWordSchema,
} from "../../../../../validations/pb/schema";
import {
  RoundSchemaType,
  StoredWordSchemaType,
} from "../../../../../validations/pb/types";
import CTAHeader from "../../cta";
export default async function Page({ params }: { params: { wordID: string } }) {
  const { mode, pb, userID } = await GetUserMode();
  if (userID === null) redirect("/");
  let wordData: StoredWordSchemaType | null = null;
  let dictionaryData: DictionarySchemaType | null = null;
  let roundInfo: RoundSchemaType | null = null;

  try {
    wordData = await memoize(
      async (wordID: string) => {
        const wordRecord = await pb.collection("real_words").getOne(wordID);

        const parsedWord = StoredWordSchema.parse(wordRecord);
        return parsedWord;
      },
      {
        revalidateTags: [`${CACHED_TAGS.global_words}`],
        log: ["datacache", "verbose"],
      },
    )(params.wordID);
  } catch (error) {
    console.log(error);
    redirect("/dashboard/word-bank?state=word_not_found");
  }

  try {
    dictionaryData = await memoize(
      async (word: string) => {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
        );
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error("Invalid JSON");

        let parsed = DictonarySchema.parse(json[0]);
        parsed.meanings = parsed.meanings.filter((meaning) => meaning !== null);
        return parsed;
      },
      {
        log: ["datacache", "verbose"],
      },
    )(wordData.word);
  } catch (error) {
    console.log(error);
    redirect("/dashboard/word-bank?state=dictionary_not_found");
  }

  try {
    roundInfo = await memoize(
      async (wordID: string, user: string) => {
        const roundRecord = await pb
          .collection("rounds")
          .getFirstListItem(`real_word = "${wordID}" && game.user = "${user}"`);

        const parsedRound = RoundSchema.parse(roundRecord);
        return parsedRound;
      },
      {
        revalidateTags: [`${CACHED_TAGS.user_games}`],
        log: ["datacache", "verbose"],
      },
    )(wordData.id, userID!);
  } catch (error) {
    console.log(error);
    redirect("/dashboard/word-bank?state=round_not_found");
  }

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-start bg-[#1E1E1E]">
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex h-full w-full max-w-full-page flex-col items-start justify-start gap-5 px-4 py-5 xl:px-0 xl:py-10"
      >
        <h1 className="text-base font-bold leading-relaxed tracking-title text-white md:text-xl">
          <Link
            href="/dashboard"
            className="block text-white/50 md:inline xl:text-lg"
          >
            DASHBOARD
          </Link>
          <Link
            href="/dashboard/word-bank"
            className="block text-white/50 md:inline xl:text-lg"
          >
            /WORD BANK
          </Link>
          /{wordData.word}
        </h1>
        <CTAHeader />
        <div className="flex h-fit w-full flex-col items-start justify-start gap-8 pt-8">
          <div className="flex h-fit w-fit flex-col items-start justify-start gap-2">
            <p className="text-sm text-white/60 md:text-base xl:text-lg">
              Word:
            </p>
            <p className="text-lg font-bold tracking-title text-white md:text-xl xl:text-2xl">
              {NameFormat(wordData?.word!)}
            </p>
          </div>
          <div className="flex h-fit w-full flex-col items-start justify-start gap-2">
            <p className="text-sm text-white/60 md:text-base xl:text-lg">
              Usage:
            </p>
            <div className="h-fit w-full rounded-sm bg-blue-500/20 p-4 shadow-md shadow-black">
              {dictionaryData?.meanings.map((meaning, index) => {
                return (
                  <div
                    key={index}
                    className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2"
                  >
                    <p className="mb-auto line-clamp-1 text-xs text-white/50">
                      Part of Speech:
                    </p>
                    <p className="line-clamp-1 text-sm text-white">
                      {NameFormat(meaning.partOfSpeech)}
                    </p>
                    {meaning.definitions.map((definition, index) => {
                      if (definition === undefined) return null;
                      return (
                        <div
                          key={index}
                          className="flex h-fit w-full flex-col items-start justify-start gap-4"
                        >
                          <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                            <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                              Definition:
                            </p>
                            <p className="text-xs text-white md:text-sm">
                              {definition.definition}
                            </p>
                          </div>
                          {definition.example && (
                            <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                              <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                                Example:
                              </p>
                              <p className="text-xs text-white md:text-sm">
                                {definition.example}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex h-fit w-full flex-col items-start justify-start gap-2">
            <p className="text-sm text-white/60 md:text-base xl:text-lg">
              Game Info:
            </p>
            <div className="h-fit w-full rounded-sm bg-pink-500/20 p-4 shadow-md shadow-black">
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Level:
                </p>
                <p className="text-xs text-white md:text-sm">
                  {wordData.level}
                </p>
              </div>
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Added On:
                </p>
                <p className="text-xs text-white md:text-sm">
                  {FormatDate1(new Date(wordData.created))}
                </p>
              </div>
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Definition
                </p>
                <p className="text-xs text-white md:text-sm">
                  {NameFormat(wordData.definition)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-fit w-full flex-col items-start justify-start gap-2">
            <p className="text-sm text-white/60 md:text-base xl:text-lg">
              Round Info:
            </p>
            <div className="h-fit w-full rounded-sm bg-green-500/20 p-4 shadow-md shadow-black">
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Round Number:
                </p>
                <p className="text-xs text-white md:text-sm">
                  {roundInfo.round_number}
                </p>
              </div>
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  User Choice:
                </p>
                <p className="text-xs text-white md:text-sm">
                  {roundInfo.correct ? "Sense" : "Nonsense"}
                </p>
              </div>
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Total Time Taken
                </p>
                <p className="text-xs text-white md:text-sm">
                  {roundInfo.time_elapsed}
                  <span className="text-xss md:text-xs">s</span>
                </p>
              </div>
              <div className="flex h-fit w-full flex-col items-start justify-start gap-2 py-2 pl-3">
                <p className="mb-auto line-clamp-1 text-xss text-white/50 md:text-xs">
                  Attempted On:
                </p>
                <p className="text-xs text-white md:text-sm">
                  {FormatDate1(new Date(roundInfo.created))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
