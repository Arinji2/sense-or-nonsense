import { DifficultyList } from "../difficulty/difficully";
import EditButton from "./edit.client";

export default function Difficulty({ difficultyID }: { difficultyID: string }) {
  const difficulty = DifficultyList.find(
    (difficult) => difficult.level === Number.parseInt(difficultyID),
  )!;
  return (
    <div className="flex h-fit w-full flex-col items-start justify-center gap-4">
      <div className="flex h-fit w-fit flex-row items-center justify-center gap-6">
        <p className="text-2xl font-medium tracking-text text-white md:text-3xl">
          <span className="text-yellow-500">4. </span>DIFFICULTY
        </p>
        <EditButton objKey="difficulty" />
      </div>
      <button
        style={
          {
            "--difficultyColor": difficulty.color.concat("80"),
          } as React.CSSProperties
        }
        className="relative flex aspect-video max-h-[150px] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-[--difficultyColor] xl:w-[300px]"
      >
        <div className="line-clamp-2 h-fit w-fit">
          <p className="text-left text-lg font-medium text-white xl:text-[50px]">
            {difficulty.name.toUpperCase()}
          </p>
        </div>
      </button>
    </div>
  );
}
