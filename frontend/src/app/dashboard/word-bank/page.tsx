import { unstable_cache } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CACHED_TAGS } from "../../../../constants/tags";
import { GetUserMode } from "../../../../utils/getMode";
import { RoundSchema } from "../../../../validations/pb/schema";
import CTAHeader from "../cta";
import FiltersContainer from "./filters.client";
import Words from "./items.client";
import Pagination from "./pagination.client";
import Search from "./search.client";
import StateLogger from "./state-logger.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page: string | string[] | undefined;
    level: string | string[] | undefined;
    option: string | string[] | undefined;
    attempted: string | string[] | undefined;
    search: string | string[] | undefined;
  };
}) {
  const { mode, pb, userID } = await GetUserMode();
  if (userID === null) redirect("/");
  let pageNumber = 1;
  let levelFilter = 0;
  let optionFilter = 0;
  let attemptedFilter = 0;
  let filterString = "";

  if (searchParams.search && !Array.isArray(searchParams.search)) {
    filterString = ` && real_word.word ~ "${searchParams.search}"`;
  }

  if (searchParams.level && !Array.isArray(searchParams.level)) {
    levelFilter = parseInt(searchParams.level);
    if (isNaN(pageNumber)) {
      levelFilter = 0;
    }
  }

  if (searchParams.option && !Array.isArray(searchParams.option)) {
    optionFilter = parseInt(searchParams.option);
    if (isNaN(optionFilter)) {
      optionFilter = 0;
    }
  }

  if (searchParams.attempted && !Array.isArray(searchParams.attempted)) {
    attemptedFilter = parseInt(searchParams.attempted);
    if (isNaN(attemptedFilter)) {
      attemptedFilter = 0;
    }
  }

  if (searchParams.page && !Array.isArray(searchParams.page)) {
    pageNumber = parseInt(searchParams.page);
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }
  }
  const getSortString = (
    levelFilter: number,
    optionFilter: number,
    attemptedFilter: number,
  ) => {
    const sortCriteria = [];

    if (levelFilter !== 0) {
      sortCriteria.push(`${levelFilter === 1 ? "-" : ""}real_word.level`);
    }

    if (optionFilter !== 0) {
      sortCriteria.push(`${optionFilter === 1 ? "-" : ""}correct`);
    }

    if (attemptedFilter !== 0) {
      sortCriteria.push(`${attemptedFilter === 1 ? "-" : ""}created`);
    }

    return sortCriteria.join(",") || "-created";
  };

  const sortString = getSortString(levelFilter, optionFilter, attemptedFilter);

  const wordsRecord = await unstable_cache(
    async (
      locPageNumber: number,
      locUserID: string,
      locFilterString: string,
      locSortString: string,
    ) => {
      return await pb.collection("rounds").getList(locPageNumber, 10, {
        filter: `game.user = "${locUserID}" && is_fake = false && real_word != ""${locFilterString}`,
        expand: "real_word,game",
        sort: locSortString.length > 2 ? locSortString : "-created",
      });
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
    },
  )(pageNumber, userID!, filterString, sortString);

  const parsedWords = wordsRecord.items
    .map((word) => {
      const parse = RoundSchema.safeParse(word);
      if (parse.success) {
        return parse.data;
      }
      return null;
    })
    .filter((word) => word !== null);

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
          /WORD BANK
        </h1>
        <CTAHeader />

        <p className="pb-5 text-sm text-white/70">
          This is the word bank, it contains all the correct words you have
          encountered throughout your games.{" "}
        </p>
        <StateLogger />
        <div className="flex h-fit w-full flex-col items-stretch justify-center gap-4 xl:flex-row">
          <Search />
          <FiltersContainer resultsFound={wordsRecord.totalItems} />
        </div>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="flex h-full w-full flex-col items-center justify-start gap-10"
        >
          <Words words={parsedWords} />
          <Pagination
            pageNumber={pageNumber}
            totalPages={wordsRecord.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
