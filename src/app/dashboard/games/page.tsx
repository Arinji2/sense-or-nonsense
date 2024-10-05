import { unstable_cache } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ListResult, RecordModel } from "pocketbase";
import { CACHED_TAGS } from "../../../../constants/tags";
import { GetUserMode } from "../../../../utils/getMode";
import { GameSchema } from "../../../../validations/pb/schema";
import { GameSchemaType } from "../../../../validations/pb/types";
import FiltersContainer from "./filters.client";
import Words from "./items.client";
import Pagination from "./pagination.client";
import StateLogger from "./state-logger.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page: string | string[] | undefined;
    level: string | string[] | undefined;
    attempted: string | string[] | undefined;
    type: string | string[] | undefined;
  };
}) {
  const { mode, pb, userID } = await GetUserMode();
  if (userID === null) redirect("/");
  let pageNumber = 1;
  let levelFilter = 0;
  let attemptedFilter = 0;
  let typeFilter = 0;
  let filterString = "";

  if (searchParams.level && !Array.isArray(searchParams.level)) {
    levelFilter = parseInt(searchParams.level);
    if (isNaN(pageNumber)) {
      levelFilter = 0;
    }
  }

  if (searchParams.attempted && !Array.isArray(searchParams.attempted)) {
    attemptedFilter = parseInt(searchParams.attempted);
    if (isNaN(attemptedFilter)) {
      attemptedFilter = 0;
    }
  }

  if (searchParams.type && !Array.isArray(searchParams.type)) {
    typeFilter = parseInt(searchParams.type);
    if (isNaN(typeFilter)) {
      typeFilter = 0;
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
    attemptedFilter: number,
    typeFilter: number,
  ) => {
    const sortCriteria = [];

    if (levelFilter !== 0) {
      sortCriteria.push(`${levelFilter === 1 ? "-" : ""}difficulty`);
    }
    if (attemptedFilter !== 0) {
      sortCriteria.push(`${attemptedFilter === 1 ? "-" : ""}created`);
    }
    if (typeFilter !== 0) {
      sortCriteria.push(`${typeFilter === 1 ? "-" : ""}gameID`);
    }

    return sortCriteria.join(",") || "-created";
  };

  const sortString = getSortString(levelFilter, attemptedFilter, typeFilter);

  const gamesRecords = await unstable_cache(
    async (
      locPageNumber: number,
      locUserID: string,
      locFilterString: string,
      locSortString: string,
    ) => {
      try {
        const data = await pb.collection("games").getList(locPageNumber, 10, {
          filter: `user = "${locUserID}" && completed=true && ${locFilterString}`,
          sort: locSortString.length > 2 ? locSortString : "-created",
        });

        return data;
      } catch (e: any) {
        return {} as ListResult<RecordModel>;
      }
    },
    [],
    {
      tags: [`${CACHED_TAGS.user_games}-${userID}`],
    },
  )(pageNumber, userID!, filterString, sortString);
  let parsedGames: GameSchemaType[] = [];
  if (Object.keys(gamesRecords).length > 0) {
    parsedGames = gamesRecords.items
      .map((word) => {
        const parse = GameSchema.safeParse(word);
        if (parse.success) {
          return parse.data;
        }
        return null;
      })
      .filter((word) => word !== null);
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
          /GAMES
        </h1>

        <p className="pb-5 text-sm text-white/70">
          View all of the games you have played.
        </p>
        <StateLogger />
        <div className="flex h-fit w-full flex-col items-stretch justify-center gap-4 xl:h-[50px] xl:flex-row">
          <FiltersContainer resultsFound={gamesRecords.totalItems} />
        </div>
        <div
          style={{
            minHeight: "inherit",
          }}
          className="flex h-full w-full flex-col items-center justify-start gap-10"
        >
          <Words games={parsedGames} />
          <Pagination
            pageNumber={pageNumber}
            totalPages={gamesRecords.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
