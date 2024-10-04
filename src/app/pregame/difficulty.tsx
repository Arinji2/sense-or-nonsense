import { DifficultyList } from "../difficulty/difficully";
import EditButton from "./edit.client";

export default function Difficulty({ difficultyID }: { difficultyID: string }) {
  const difficulty = DifficultyList.find(
    (difficult) => difficult.level === Number.parseInt(difficultyID),
  )!;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-[150px] w-full flex-col items-center justify-center gap-2 md:w-fit xl:h-[200px] xl:w-[400px]">
        <div className="flex h-fit w-full flex-row items-end justify-start gap-2">
          <span className="text-lg text-yellow-500">3. </span>
          <p className="text-lg text-white md:text-xl xl:text-2xl">
            DIFFICULTY
          </p>
          <EditButton objKey="difficulty" />
        </div>
        <div
          style={
            {
              "--difficultyColor": difficulty.color.concat("80"),
            } as React.CSSProperties
          }
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md bg-[--difficultyColor]"
        >
          <div className="line-clamp-2 h-fit w-fit">
            <p className="text-left text-xl font-bold text-white md:text-2xl xl:text-3xl">
              {difficulty.name.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
