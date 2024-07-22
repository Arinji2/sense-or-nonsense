import { DifficultyList } from "../difficulty/difficully";
import EditButton from "./edit.client";

export default function Difficulty({ difficultyID }: { difficultyID: string }) {
  const difficulty = DifficultyList.find(
    (difficult) => difficult.level === Number.parseInt(difficultyID)
  )!;
  return (
    <div className="w-full h-fit flex flex-col items-start justify-center gap-4">
      <div className="w-fit h-fit flex flex-row items-center justify-center gap-6">
        <p className="text-2xl md:text-3xl text-white font-medium tracking-text">
          <span className="text-yellow-500">4. </span>DIFFICULTY
        </p>
        <EditButton objKey="difficulty" reset />
      </div>
      <button
        style={
          {
            "--difficultyColor": difficulty.color.concat("80"),
          } as React.CSSProperties
        }
        className="xl:w-[300px] max-h-[150px] bg-[--difficultyColor] w-full aspect-video rounded-md overflow-hidden flex flex-col items-center justify-center  relative"
      >
        <div className="w-fit line-clamp-2 h-fit">
          <p className="text-white font-medium text-lg xl:text-[50px] text-left ">
            {difficulty.name.toUpperCase()}
          </p>
        </div>
      </button>
    </div>
  );
}
